import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './login.css'; // Import your CSS file

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /^\S+@\S+\.\S+$/.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!validateEmail(email.trim())) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        if (password.trim().length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email: email.trim(), password: password.trim() },
                { withCredentials: true }
            );

            if (response.data?.token) {
                localStorage.setItem("token", `Bearer ${response.data.token}`);
                navigate("/dashboard");
            } else {
                setError("Invalid response from server.");
            }
        } catch (err) {
            setError(err.response?.data?.msg || "Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.trim())}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`login-button ${loading ? "disabled" : ""}`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="signup-link">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/signup")}>
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;