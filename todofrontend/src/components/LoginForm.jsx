import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import "../Styling/Login.css";

export default function LoginForm({ setIsLoggedIn }) {
    // to make sure user if user is loggedin and clicks on login he gets redirected to home page instead of login again
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, []);

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // state for messages
    const [message, setMessage] = useState("");

    // user api
    const UserApi = process.env.REACT_APP_USER_API_URL;

    function changHandler(e) {
        setFormData((prevData) => (
            { ...prevData, [e.target.name]: e.target.value }
        ))
    }

    async function loginUser(e) {
        e.preventDefault();

        const data = {
            userName: formData.username,
            password: formData.password
        }

        try {
            const response = await axios.post(`${UserApi}/login`, data);

            localStorage.setItem("token", response.data.token); // Save the token in localStorage
            setIsLoggedIn(true);
            toast.success("Login Successfull");
            setFormData({ username: "", password: "" })
            navigate("/");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Handle specific backend message for duplicate account
                setMessage(error.response.data); // Show backend message
            } else {
                console.log("Inside loginUser error:", error.response?.data || error);
            }
        }
    }




    return (
        <div className="login-form-container">
            {
                <form onSubmit={loginUser} method="POST" className="login-form">
                    <label className="text-black" htmlFor="username">Username</label>
                    <input
                        className="input-field"
                        required
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter Username"
                        value={formData.username}
                        onChange={changHandler}
                    />

                    <label className="text-black" htmlFor="password">Password</label>
                    <input
                        className="input-field"
                        required
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        placeholder="Enter Password"
                        onChange={changHandler}
                    />

                    <div className="flex justify-between">
                        {/* Container for Show Password label and checkbox */}
                        <div className="flex items-center space-x-2">
                            <label className="text-black" htmlFor="showPassword">Show Password</label>
                            <input
                                className="left-10"
                                type="checkbox"
                                name="showPassword"
                                id="showPassword"
                                onClick={() => setShowPassword((prev) => !prev)}
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div style={{ cursor: "pointer" }}>
                            <Link className="text-blue-600" to="/forgot-password">Forgot password?</Link>
                        </div>
                    </div>


                    {message && (
                        <div className="error-message">{message}</div>
                    )}

                    <button className="submit-button" type="submit">Log In</button>
                    <button onClick={() => navigate("/signup")} className="create-account-button">
                        New here? Create Account.
                    </button>
                </form>
            }

        </div>
    );
}