// src/components/Login.js
import React, { useState } from 'react';
import './login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');

    const handleLogin = () => {
        if (username.trim()) {
            onLogin(username);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Welcome to Chatic</h2>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
            />
            <button onClick={handleLogin} className="login-button">
                Login
            </button>
        </div>
    );
};

export default Login;
