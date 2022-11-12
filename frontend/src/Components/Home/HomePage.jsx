import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import "./home.css";
import createAxios from "../../util/instance";
import { loginSuccess } from "../../redux/authSlice";

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);

    // user list get from redux store
    const usersData = useSelector((state) => state.users.users?.allUsers);
    const msg = useSelector((state) => state.users?.msg);

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    console.log(user);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        if (user?.accessToken) {
            getAllUsers(user?.accessToken, dispatch, axiosJWT);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usersData]);

    const handleDelete = (id) => {
        deleteUser(id, user?.accessToken, dispatch, axiosJWT);
    };

    return (
        <main className="home-container">
            <div className="home-title">User List</div>
            <div>{`Your role: ${user?.admin ? "Admin" : "User"}`}</div>
            <div>{`${msg}`}</div>
            <div className="home-userlist">
                {usersData?.map((user, index) => {
                    return (
                        <div className="user-container" key={index}>
                            <div className="home-user">{user.username}</div>
                            <div
                                className="delete-user"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(user._id);
                                }}
                            >
                                {" "}
                                Delete{" "}
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default HomePage;
