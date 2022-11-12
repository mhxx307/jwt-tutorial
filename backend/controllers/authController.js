const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const User = require("../models/User");

const refreshTokens = [];

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, admin: user.admin }, process.env.JSON_ACCESS_KEY, {
        expiresIn: "30s",
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, admin: user.admin }, process.env.JSON_REFRESH_KEY, {
        expiresIn: "30s",
    });
};

const authController = {
    registerUser: async (req, resp) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create a new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            // Save to database
            const user = await newUser.save();
            return resp.status(200).json(user);
        } catch (error) {
            return resp.status(500).json(error);
        }
    },

    loginUser: async (req, resp) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return resp.status(404).json("User not found");
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return resp.status(404).json("Wrong password");
            }
            if (user && validPassword) {
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                resp.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                const { password, ...others } = user._doc;
                return resp.status(200).json({ ...others, accessToken });
            }
        } catch (err) {
            return resp.status(500).json(err);
        }
    },

    refreshToken: async (req, resp) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return resp.status(401).json("You are not authenticated");
        if (!refreshTokens.includes(refreshToken))
            return resp.status(403).json("Refresh token is not valid");
        // delete old refresh token
        refreshTokens.filter((token) => token !== refreshToken);
        jwt.verify(refreshToken, process.env.JSON_REFRESH_KEY, (err, user) => {
            if (err) {
                return resp.status(403).json("Refresh token is not valid");
            } else {
                const newAccessToken = generateAccessToken(user);
                const newRefreshToken = generateRefreshToken(user);
                // add refresh token to database
                refreshTokens.push(newRefreshToken);
                resp.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                return resp.status(200).json(newAccessToken);
            }
        });
    },

    logoutUser: async (req, resp) => {
        resp.clearCookie("refreshToken");
        refreshTokens.filter((token) => token !== req.cookies.refreshToken);
        return resp.status(200).json("Logged out");
    },
};

module.exports = authController;
