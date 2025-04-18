import { Link } from 'react-router-dom';
import islandImage from '../assets/island.png';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      {/* nav bar */}
      <nav className="nav-bar">
        <div className="logo">IslandOps</div>
        <div className="nav-links">
          <Link to="/">home</Link>
          <Link to="/about">about</Link>
          <Link to="/login">login</Link>
        </div>
      </nav>

      <div className="contact-content">
        {/* left section */}
        <div className="left-section">
          <h1 className="welcome-text">contact us.</h1>
          <p className="contact-text">we're here to help.</p>
          <img src={islandImage} alt="Island" className="island-image" />
        </div>

        {/* right section */}
        <div className="right-section">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you! Here's how you can reach us:</p>
            
            <div className="info-section">
              <h3>Email</h3>
              <p>islandopscustomersupport@gmail.com</p>
            </div>

            <div className="info-section">
              <h3>Phone</h3>
              <p>1-800-ISLANDS</p>
            </div>

            <div className="info-section">
              <h3>Address</h3>
              <p>1420 Baja Blast Blvd</p>
              <p>Paradise, CA, 95969 </p>
            </div>

            <div className="info-section">
              <h3>Business Hours</h3>
              <p>Monday - Friday: 11:59 AM - 12:00 PM</p>
              <p>Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;