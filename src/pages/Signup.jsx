import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import './Signup.css'; // Import your CSS file

const Signup = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "name" ? value.trimStart() : value.trim(),
        }));
    };

    const validateEmail = (email) => {
        return /^\S+@\S+\.\S+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!validateEmail(formData.email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/signup",
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.status === 201 || res.status === 200) {
                setSuccess("Signup successful! Redirecting to login...");
                setFormData({ name: "", email: "", password: "" });
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (error) {
            setError(error.response?.data?.msg || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">Signup</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`signup-button ${loading ? "disabled" : ""}`}
                    >
                        {loading ? "Signing up..." : "Signup"}
                    </button>
                </form>

                <p className="login-link">
                    Already have an account?{" "}
                    <Link to="/login" className="login-text">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;