// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to TaskBoard</h1>
      <p>A collaborative real-time task management app.</p>

      <div className="home-buttons">
        <Link to="/login" className="btn-primary">Login</Link>
        <Link to="/register" className="btn-secondary">Register</Link>
      </div>
    </div>
  );
};

export default Home;
