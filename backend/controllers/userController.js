const User = require("../models/User");

const userController = {
    getAllUsers: async (req, resp) => {
        try {
            const users = await User.find();
            return resp.status(200).json(users);
        } catch (error) {
            return resp.status(500).json(error);
        }
    },
    deleteUser: async (req, resp) => {
        try {
            // mock delete
            // const user = await User.findById(req.params.id);
            // real delete
            const user = await User.findByIdAndDelete(req.params.id);
            if (user) {
                return resp.status(200).json("delete successful");
            } else {
                return resp.status(404).json("user not found");
            }
        } catch (error) {
            return resp.status(500).json(error);
        }
    },
};

module.exports = userController;
