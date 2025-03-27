import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  // Check if user is authenticated
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <nav className="nav-bar">
        <div className="logo">IslandOps</div>
        <div className="nav-links">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
            className="logout-btn"
          >
            logout
          </button>
        </div>
      </nav>
      <div className="dashboard-content">
        <h1>This is your productivity dashboard</h1>
        <p>Currently under development</p>
      </div>
    </div>
  );
};

export default Home;
