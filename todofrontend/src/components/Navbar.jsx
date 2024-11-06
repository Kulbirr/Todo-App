import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import '../Styling/Navbar.css'; // Import the CSS file

export default function Navbar(props) {
    let isLoggedIn = props.isLoggedIn;
    let setIsLoggedIn = props.setIsLoggedIn;
    let onLogOut = props.onLogOut;

    const navigate = useNavigate();

    // Handler functions for navigation
    const handleRegister = () => {
        navigate("/signup"); // Redirect to /signup
    };

    const handleLogin = () => {
        navigate("/login"); // Redirect to /login
    };

    const handleToDoHome = () => {
        navigate("/todos"); // Redirect to /todo home
    };

    function handleHome(){
        navigate("/");
    }

    const handleLogout = () => {
        onLogOut(); // Call the logout function passed down as a prop
        navigate("/"); // Redirect to home after logout
        toast.success("Logged out successfully!"); // Toast notification
    };

    return (
        <nav>
            <div className="nav-container">
                <div
                    className="nav-title font-bold text-2xl"
                    onClick={handleHome}  // Make "Your ToDos" clickable
                    style={{ cursor: "pointer" }}>
                    Your ToDos
                </div>

                <div className="flex"> {/* Ensure buttons are centered vertically */}
                    {!isLoggedIn ? (
                        <>
                            <button
                                onClick={handleRegister}
                                className="nav-button"
                            >
                                Register
                            </button>
                            <button
                                onClick={handleLogin}
                                className="nav-button"
                            >
                                Login
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleToDoHome}
                                className="nav-button"
                            >
                                ToDo Home
                            </button>
                            <button
                                onClick={handleLogout}
                                className={`nav-button logout`}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}