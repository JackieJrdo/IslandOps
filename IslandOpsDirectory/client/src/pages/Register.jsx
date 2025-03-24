import { useState } from 'react';
import { Link } from 'react-router-dom';
// import assets for the registration page
import personIcon from '../assets/person.png';
import emailIcon from '../assets/inbox.png';
import lockIcon from '../assets/password.png';
import islandIcon from '../assets/island_icon.png';
import bareIslandImage from '../assets/empty_island.png';
import './Register.css';

/**
 * register component
 * handles new user registration with a modern, clean UI design
 * features a split layout with bare island image on the left and account creation form on the right
 * backend expects first name, last name, username, email, and password for registration
 */
const Register = () => {
  // state management for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // form submission handler -> to be connected to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic here
    // backend expects: { firstname, lastname, email, username, password }
  };

  return (
    <div className="register-container">
      {/* nav bar */}
      <nav className="nav-bar">
        <div className="logo">IslandOps</div>
        <div className="nav-links">
          <Link to="/">home</Link>
          <Link to="/about">about</Link>
          <Link to="/contact">contact us</Link>
        </div>
      </nav>

      <div className="register-content">
        {/* left section with account creation text and bare island image */}
        <div className="left-section">
          <h1 className="welcome-text">create account.</h1>
          <p className="signin-text">sign up to get started.</p>
          <img src={bareIslandImage} alt="Island" className="island-image" />
        </div>

        {/* right section with registration form */}
        <div className="right-section">
          <form onSubmit={handleSubmit}>
            {/* first name input group with icon */}
            <div className="input-group">
              <div className="icon-container">
                <img src={personIcon} alt="First Name" />
              </div>
              <input
                type="text"
                placeholder="first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* last name input group with icon */}
            <div className="input-group">
              <div className="icon-container">
                <img src={personIcon} alt="Last Name" />
              </div>
              <input
                type="text"
                placeholder="last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* email input group with icon */}
            <div className="input-group">
              <div className="icon-container">
                <img src={emailIcon} alt="Email" />
              </div>
              <input
                type="email"
                placeholder="e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* username input group with icon */}
            <div className="input-group">
              <div className="icon-container">
                <img src={islandIcon} alt="Username" />
              </div>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* password input group with icon */}
            <div className="input-group">
              <div className="icon-container">
                <img src={islandIcon} alt="Password" />
              </div>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* submit button */}
            <button type="submit" className="continue-btn">
              sign up
            </button>

            {/* sign in link */}
            <p className="signup-text">
              already have an account? <Link to="/">sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
