import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ToDoHome from "./Pages/ToDoHome";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import NotFound from "./Pages/NotFound";
import "./index.css";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check local storage for token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token"); // get the stored token on login
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} onLogOut={handleLogout} />
      <div className="flex items-center justify-center h-screen w-full">


        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/signup" element={<SignupForm setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/todos" element={<ToDoHome isLoggedIn={isLoggedIn} />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm/>} />
          <Route path="*" element={<NotFound />} /> {/* Handle 404s */}
        </Routes>
      </div>
    </div>

  );
}

export default App;
