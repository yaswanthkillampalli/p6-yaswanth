// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchUserProfile } from "../api/axiosInstance";
import ProfilePopupMenu from "./ProfilePopupMenu";
import "../styles.css";

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = !!sessionStorage.getItem("token");

    useEffect(() => {
        const loadUserProfile = async () => {
            if (isLoggedIn) {
                try {
                    const data = await fetchUserProfile();
                    setUser(data);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    if (error.response?.status === 401) {
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("userId");
                        setUser(null);
                        navigate("/login", { replace: true });
                    }
                }
            }
            setLoading(false);
        };

        loadUserProfile();
    }, [navigate, isLoggedIn]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        setUser(null);
        navigate("/logout", { replace: true }); // Navigate to /logout
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <div className="d-flex align-items-center">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/home">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/trending">
                                    Trending
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/recent">
                                    Recent
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/about">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Link className="navbar-brand mx-auto" to="/">
                    <img
                        src="/recipe-logo.jpg"
                        className="recipe-logo-settings"
                        alt="Recipe Logo"
                    />
                </Link>

                <div className="d-flex align-items-center">
                    <i
                        className="fas fa-search search-icon me-3"
                        onClick={() => navigate("/search")}
                    ></i>

                    {loading ? (
                        <p className="loading-text">Loading...</p>
                    ) : isLoggedIn && user ? (
                        <ProfilePopupMenu user={user} onLogout={handleLogout} />
                    ) : (
                        <Link className="btn btn-outline-success" to="/login">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}