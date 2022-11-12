import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: {
            allUsers: [],
            isFetching: false,
            error: false,
        },
        msg: "",
    },
    reducers: {
        getUsersStart: (state) => {
            state.users.isFetching = true;
        },
        getUsersSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.allUsers = action.payload;
        },
        getUsersFailure: (state) => {
            state.users.isFetching = false;
            state.users.error = true;
        },

        // delete user
        deleteUserStart: (state) => {
            state.users.isFetching = true;
        },
        deleteUserSuccess: (state, action) => {
            state.users.isFetching = false;
            // render the new list of users
            state.users.allUsers = state.users.allUsers.filter(
                (user) => user._id !== action.payload._id
            );
        },
        deleteUserFailure: (state, action) => {
            state.users.isFetching = false;
            state.users.error = true;
            state.msg = action.payload;
        },
    },
});

export const {
    getUsersFailure,
    getUsersStart,
    getUsersSuccess,
    deleteUserFailure,
    deleteUserSuccess,
    deleteUserStart,
} = userSlice.actions;

export default userSlice.reducer;
