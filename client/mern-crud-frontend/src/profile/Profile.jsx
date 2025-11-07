import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig.js';
import toast from 'react-hot-toast';
import './profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        toast.error('Error loading profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (!user) {
    return <div className="profile-container">No user data found</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>
      
      <div className="profile-card">
        <div className="profile-card-content">
          <div className="profile-avatar">
            <i className="fa-solid fa-user-circle"></i>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user.userName}</h2>
            <div className="profile-meta">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="profile-description">
              Welcome to your profile page. Here you can view your account information and manage your settings.
            </p>
            <p className="profile-description">
             {new Date().getDate()} {new Date().getMonth()} {new Date().getFullYear()}
            </p>
            
          </div>
        </div>
        <div className="profile-background"></div>
      </div>

      <Link to="/employee" className="profile-back-btn">
        <i className="fa-solid fa-arrow-left"></i> Back to Employees
      </Link>
    </div>
  );
};

export default Profile;