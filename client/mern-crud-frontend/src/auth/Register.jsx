import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig.js';
import toast from 'react-hot-toast';
import { setToken } from '../utils/auth.js';
import './register.css';

const Register = () => {
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', userData);
      
      setToken(response.data.token);
      
      toast.success('Registration successful!');
      navigate('/employee');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register">
      <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={userData.userName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
        </form>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Register;