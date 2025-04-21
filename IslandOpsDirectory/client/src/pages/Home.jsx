import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

/**
 * Home component
 * displays the main landing page with a modern, clean UI design
 * features a hero section with a call-to-action button
 */
const Home = () => {
  return (
    <div className="home-container">
      <nav className="nav-bar">
        <div className="logo">IslandOps</div>
        <div className="nav-links">
          <Link to="/about" className="nav-link">about us</Link>
          <Link to="/contact" className="nav-link">contact us</Link>
        </div>
      </nav>
      // ... rest of existing code ...
    </div>
  );
};

export default Home; 