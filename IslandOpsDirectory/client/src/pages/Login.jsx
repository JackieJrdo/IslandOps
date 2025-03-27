import { useState } from 'react';
import { Link } from 'react-router-dom';
// import assets for the login page
import personIcon from '../assets/person.png';
import lockIcon from '../assets/password.png';
import islandImage from '../assets/island.png';
import './Login.css';

/**
 * login component
 * handles user authentication with a modern, clean UI design
 * features a split layout with island image on the left and login form on the right
 * backend expects username (not email) for login
 */
const Login = () => {
  // state management for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // form submission handler -> to be connected to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement authentication logic here
    // backend expects: { username, password }
    try {
      // post request to submit inputted username & password to backend
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      // stores token on local storage so that token storage is persistent
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
      }
      else {
        alert("Login failed");
      }
    }
    catch (err) {
      console.error("Login error: ", err);
      alert("There was an issue. Please try again.");
    };
  };

  // state for validation errors
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // validation patterns
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // Password must contain:
  // - At least 8 characters
  // - At least one uppercase letter
  // - At least one number
  // - At least one special character

  // validation functions
  const validateUsername = (username) => {
    if (!username) {
      setUsernameError('Username is required');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (!passwordPattern.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character'
      );
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Handle input changes with validation

  // Checks if username matches regex pattern
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value);
  };

  // Checks in password matches regex pattern
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };
  
  return (
    <div className="login-container">
      {/* nav bar */}
      <nav className="nav-bar">
        <div className="logo">IslandOps</div>
        <div className="nav-links">
          <Link to="/">home</Link>
          <Link to="/about">about</Link>
          <Link to="/contact">contact us</Link>
        </div>
      </nav>

      <div className="login-content">
        {/* left section with welcome text and island image */}
        <div className="left-section">
          <h1 className="welcome-text">welcome back.</h1>
          <p className="signin-text">let's sign you in.</p>
          <img src={islandImage} alt="Island" className="island-image" />
        </div>

        {/* right section with login form */}
        <div className="right-section">
          <form onSubmit={handleSubmit}>
            {/* username error and input group */}
            <div>
              {usernameError && <div className="error-message">{usernameError}</div>}
              <div className="input-group">
                <div className="icon-container">
                  <img src={personIcon} alt="Username" />
                </div>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={handleUsernameChange}
                  className={usernameError ? 'error' : ''}
                />
              </div>
            </div>

            {/* password error and input group */}
            <div>
              {passwordError && <div className="error-message">{passwordError}</div>}
              <div className="input-group">
                <div className="icon-container">
                  <img src={lockIcon} alt="Password" />
                </div>
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={passwordError ? 'error' : ''}
                />
              </div>
            </div>

            {/* submit button */}
            <button type="submit" className="continue-btn">
              sign in
            </button>

            {/* sign up link */}
            <p className="signup-text">
              don't have an account? <Link to="/register">sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
