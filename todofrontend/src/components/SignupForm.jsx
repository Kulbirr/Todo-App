import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import '../Styling/Signup.css'; // Import the CSS file for styling

export default function SignupForm({ setIsLoggedIn }) {
    const [formData, setFormData] = useState({ userName: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState(""); // State for OTP input
    const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP state
    const [message, setMessage] = useState(""); // State for messages
    const [loading, setLoading] = useState(false); // State for loading

    const navigate = useNavigate();
    const UserApi = process.env.REACT_APP_USER_API_URL;

    function changeHandler(event) {
        setFormData((prevData) => (
            { ...prevData, [event.target.name]: event.target.value }
        ));
    }

    function handleLoginClick() {
        navigate("/login");
    }

    // Step 1: Register user and send OTP
    async function registerUser(e) {
        e.preventDefault();
        console.log(UserApi);

        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        const data = {
            username: formData.userName,
            email: formData.email,
            password: formData.password,
        };

        setLoading(true); // Start loading when form is submitted

        try {
            const response = await axios.post(`${UserApi}/signup`, data);
            toast.success("Verify! OTP Sent to your email.");
            setMessage("");
            setIsOtpSent(true); // Show OTP form
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setMessage(error.response.data);
            } else {
                console.log("Error during registration:", error.response?.data || error);
            }
        } finally {
            setLoading(false); // Stop loading when request completes
        }
    }

    // Step 2: Verify OTP
    async function verifyOtp(e) {
        e.preventDefault();
        setLoading(true); // Start loading when OTP form is submitted
        try {
            const response = await axios.post(`${UserApi}/verify-otp`, {
                email: formData.email,
                otp: otp
            });

            toast.success("Account verified successfully");
            navigate("/login");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setMessage("Invalid OTP. Please try again.");
            } else {
                console.log("Error during OTP verification:", error.response?.data || error);
            }
        } finally {
            setLoading(false); // Stop loading when request completes
        }
    }

    return (
        <div className="signup-page-container">
            {!isOtpSent ? (
                // Signup Form
                <form onSubmit={registerUser} method="POST" className="signup-form">
                    <h2 className="text-center font-bold text-black text-sxl">Create an Account</h2>
                    <label className="text-black" htmlFor="userName">UserName</label>
                    <input
                        className="input-field"
                        required
                        type="text"
                        id="userName"
                        name="userName"
                        placeholder="Enter userName"
                        value={formData.userName}
                        onChange={changeHandler}
                    />
                    <label className="text-black" htmlFor="email">Email</label>
                    <input
                        className="input-field"
                        required
                        type="email"
                        name="email"
                        id="email"
                        onChange={changeHandler}
                        value={formData.email}
                        placeholder="Enter email"
                    />
                    <div>
                        <label className="text-black" htmlFor="pswrd">Enter password</label>
                        <input
                            className="input-field"
                            required
                            type={showPassword ? "text" : "password"}
                            id="pswrd"
                            name="password"
                            value={formData.password}
                            onChange={changeHandler}
                            placeholder="Enter password"
                        />
                        <label className="text-black" htmlFor="cnfrmPswrd">Confirm password</label>
                        <input
                            className="input-field"
                            required
                            type={showPassword ? "text" : "password"}
                            id="cnfrmPswrd"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={changeHandler}
                            placeholder="Confirm password"
                        />
                        <label htmlFor="showPassword" className="text-black">Show Password</label>
                        <input type="checkbox" id="showPassword" onClick={() => setShowPassword((prev) => !prev)} />
                    </div>
                    {message && <div className="error-message">{message}</div>}
                    <div>
                        {/* Disable the button and show loading text when loading */}
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                        <button type="button" onClick={handleLoginClick} className="login-button">Already has an account? Login.</button>
                    </div>
                </form>

            ) : (
                // OTP Verification Form
                <form onSubmit={verifyOtp} method="POST" className="otp-form">
                    {/* <h2>Enter OTP</h2> */}
                    <label htmlFor="otp" className="font-bold text-black">Enter OTP</label>
                    <input
                        className="input-field"
                        required
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                    />
                    {message && <div className="error-message">{message}</div>}
                    <button type="submit" className="font-bold submit-button">Verify OTP</button>
                </form>
            )}
        </div>
    );
}
