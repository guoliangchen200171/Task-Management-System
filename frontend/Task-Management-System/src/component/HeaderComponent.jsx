import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import { NavLink, useNavigate } from "react-router-dom";
import { isUserLoggedIn, logout } from '../service/AuthApiService';

const HeaderComponent = () => {
    const isAuth = isUserLoggedIn();
    const navigate = useNavigate();

    // 🌙 Dark Mode State
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    function toggleDarkMode() {
        setDarkMode(!darkMode);
    }

    function handleLogout() {
        logout();
        navigate('/login');
    }

    function isUrlHistory() {
        let url = window.location.href;
        return url.endsWith("history");
    }

    return (
        <div>
            <nav className="fixed-top navbar navbar-expand-lg navbar-light">
                <div className="container">
                    <NavLink className="navbar-brand" to="/">
                        <img src={logo} alt="logo" width={30} height={30} />
                    </NavLink>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <ul className="navbar-nav gap-4 ms-auto">
                        {isAuth && (
                            <li className="nav-item">
                                {isUrlHistory() ? (
                                    <NavLink className="nav-link" to="/Tasks">Tasks</NavLink>
                                ) : (
                                    <NavLink className="nav-link" to="/history">Task History</NavLink>
                                )}
                            </li>
                        )}

                        {!isAuth && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/create-account">Create account</NavLink>
                            </li>
                        )}

                        {!isAuth && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/login">Login</NavLink>
                            </li>
                        )}

                        {isAuth && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/login" onClick={handleLogout}>Logout</NavLink>
                            </li>
                        )}

                        {/* 🌙 Dark Mode Toggle — only after login */}
                        {isAuth && (
                            <li className="nav-item">
                                <button
                                    onClick={toggleDarkMode}
                                    className="btn btn-outline-secondary"
                                    style={{
                                        borderRadius: '20px',
                                        padding: '5px 12px',
                                        fontSize: '14px'
                                    }}
                                >
                                    {darkMode ? '🌙 Dark' : '☀️ Light'}
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default HeaderComponent;
