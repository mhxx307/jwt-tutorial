import {
    loginFailure,
    loginStart,
    loginSuccess,
    logoutFailure,
    logoutStart,
    logoutSuccess,
    registerFailure,
    registerStart,
    registerSuccess,
} from "./authSlice";
import axios from "axios";
import {
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    getUsersFailure,
    getUsersStart,
    getUsersSuccess,
} from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/v1/auth/login", user);
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (error) {
        dispatch(loginFailure());
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("/v1/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
    } catch (error) {
        dispatch(registerFailure());
    }
};

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get("/v1/users", {
            headers: {
                token: `Bearer ${accessToken}`,
            },
        });
        console.log(res.data);
        dispatch(getUsersSuccess(res.data));
    } catch (error) {
        dispatch(getUsersFailure());
    }
};

export const deleteUser = async (id, accessToken, dispatch, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete(`/v1/users/${id}`, {
            headers: {
                token: `Bearer ${accessToken}`,
            },
        });
        dispatch(deleteUserSuccess(res.data));
    } catch (error) {
        dispatch(deleteUserFailure(error.response.data));
    }
};

export const logoutUser = async (dispatch, navigate, token, axiosJWT, id) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post("/v1/auth/logout", id, {
            headers: {
                token: `Bearer ${token}`,
            },
        });
        dispatch(logoutSuccess());
        navigate("/login");
    } catch (error) {
        dispatch(logoutFailure());
    }
};
