import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../Styling/Login.css";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState(""); // Email state
    const [otp, setOtp] = useState(""); // OTP state
    const [Password, setPassword] = useState({ newPassword: "", cnfrmpassword: "" }); // New password state
    const [step, setStep] = useState(1); // Track the step of the process
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(""); // State for error messages
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const UserApi = process.env.REACT_APP_USER_API_URL; // User API base

    function handleEmailChange(e) {
        setEmail(e.target.value);  // Update email state as the user types
    }

    function changeHandler(e) {
        setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // Step 1: Request OTP
    async function requestOtp(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${UserApi}/forgot-password`, { email: email }, {
                headers: {
                    'Content-Type': 'application/json'  // Ensure the request is sent as JSON
                }
            });
            setLoading(false);
            setMessage("");
            toast.success("OTP sent to your email!");
            setStep(2); // Move to OTP verification step
        } catch (error) {
            setLoading(false);
            setMessage("Account with this email does not exist.");
        }
    }

    // Step 2: Verify OTP
    async function verifyOtp(e) {
        e.preventDefault();

        try {
            const response = await axios.post(`${UserApi}/reset-verify-otp`, { email, otp });
            toast.success("OTP verified. Please enter your new password.");
            setMessage("");
            setStep(3); // Move to reset password step
        } catch (error) {
            setMessage("Invalid OTP. Please try again.");
        }
    }


    // Step 3: Reset Password
    async function resetPassword(e) {
        e.preventDefault();

        if (Password.newPassword !== Password.cnfrmpassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            await axios.post(`${UserApi}/reset-password`, { email: email, password: Password.newPassword });
            toast.success("Password reset successful! You can now log in.");
            navigate("/login"); // Redirect to login page

        } catch (error) {
            setMessage("Error resetting password. Please try again.");
        }
    }

    return (
        <div className="forgot-password-container">
            {step === 1 && (
                <form onSubmit={requestOtp} className="forgot-password-form">
                    <h2 className="text-center py-5 text-2xl font-bold text-black">Forgot Password?</h2>
                    <label htmlFor="email" className="text-black font-bold">Enter your account email</label>
                    <input
                        className="input-field"
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={handleEmailChange}
                        required
                    />
                    {message && <div className="error-message">{message}</div>}
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? "Sending Otp..." : "Send Otp"}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={verifyOtp} className="verify-otp-form">
                    {/* <h2>Enter OTP</h2> */}
                    <label htmlFor="otp" className="text-2xl font-bold text-black">Enter OTP</label>
                    <input
                        className="input-field"
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        placeholder="Enter OTP"
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    {message && <div className="error-message">{message}</div>}
                    <button className="submit-button" type="submit">Verify OTP</button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={resetPassword} className="reset-password-form">
                    <h2 className="text-2xl font-bold text-black text-center py-5">Reset Password</h2>
                    <label htmlFor="newPassword" className="text-2xl text-black">New Password</label>
                    <input
                        className="input-field"
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={Password.newPassword}
                        placeholder="Enter new password"
                        onChange={changeHandler}
                        required
                    />

                    <label htmlFor="cnfrmpassword" className="text-2xl text-black">Confirm Password</label>
                    <input
                        className="input-field"
                        type={showPassword ? "text" : "password"}
                        id="cnfrmpassword"
                        name="cnfrmpassword"
                        value={Password.cnfrmpassword}
                        placeholder="Confirm password"
                        onChange={changeHandler}
                        required
                    />
                    <label className="text-black" htmlFor="showPassword">Show Password</label>
                    <input
                        className="left-10"
                        type="checkbox"
                        name="showPassword"
                        id="showPassword"
                        onClick={() => setShowPassword((prev) => !prev)}
                    />

                    {message && <div className="error-message">{message}</div>}
                    <button className="submit-button" type="submit">Reset Password</button>
                </form>
            )}
        </div>
    );
}
