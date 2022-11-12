import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/apiRequest";
import { logoutSuccess } from "../../redux/authSlice";
import createAxios from "../../util/instance";
import "./navbar.css";

const NavBar = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const accessToken = user?.accessToken;
    const userId = user?._id;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = createAxios(user, dispatch, logoutSuccess);

    const handleLogout = () => {
        console.log("logout");
        console.log(accessToken);
        console.log(userId);
        logoutUser(dispatch, navigate, accessToken, axiosJWT, userId);
    };

    return (
        <nav className="navbar-container">
            <Link to="/" className="navbar-home">
                {" "}
                Home{" "}
            </Link>
            {user ? (
                <>
                    <p className="navbar-user">
                        Hi, <span> {user.username} </span>{" "}
                    </p>
                    <button className="navbar-logout" onClick={handleLogout}>
                        {" "}
                        Log out
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" className="navbar-login">
                        {" "}
                        Login{" "}
                    </Link>
                    <Link to="/register" className="navbar-register">
                        {" "}
                        Register
                    </Link>
                </>
            )}
        </nav>
    );
};

export default NavBar;
