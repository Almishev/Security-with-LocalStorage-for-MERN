import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig.js';
import toast from 'react-hot-toast';
import { setToken } from '../utils/auth.js';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            
            setToken(response.data.token);
            
            toast.success('Login successful!');
            navigate('/employee');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login">
            <div>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                />
                <button type="submit">Login</button>
                </form>

                <Link to="/register">Don't have an account? Register</Link>
            </div>
        </div>
    );
};

export default Login;
