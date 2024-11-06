import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styling/Home.css"
import { useNavigate } from "react-router-dom";

export default function Home({ isLoggedIn }) {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const TodoApi = "http://localhost:9090/todo";
    

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Fetch user's name when logged in
    useEffect(() => {
        if (isLoggedIn) {
            fetchUserName();
        }
    }, [isLoggedIn]);

    async function fetchUserName() {
        try {
            const response = await axios.get(`${TodoApi}/home`, config);
            setMessage(response.data); // Assuming the response contains a welcome message or user name
        } catch (error) {
            console.log("Inside Home: ", error);
        }
    }

    return (
        <div className="home-page-container">
            <div className="home-content">
                {isLoggedIn ? (
                    <div className="welcome-message ">
                        <h1 className="font-bold text-2xl">Welcome Back!</h1>
                        <p>{message}</p> {/* Display user's name or message */}
                        <button className="cta-button" onClick={()=> navigate("/todos")}>View Todos</button>
                    </div>
                ) : (
                    <div className="welcome-message">
                        <h1 className="font-bold text-2xl">Welcome To Todos Application</h1>
                        <p>Please log in to see your ToDo list</p>
                        <button onClick={() => navigate('/login')} className="cta-button">Log In</button>
                    </div>
                )}
            </div>
        </div>
    );
}
