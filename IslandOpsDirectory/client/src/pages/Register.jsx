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

  // Regular Expressions, or "Regex" CRASH COURSE (for reference in other form validation)

  // Regex is super popular in form validation but looks like alien language, so here I will provide like a dictionary 
  // to refer to for specific form formats!

  //                          CHARACTERS
  
  // \d - one digit from 0-9
  // \w - word character of ASCII letter, digit, or underscore
  // \s - whitespace character like space, tab, return, newline
  // \D - One character that is not a digit
  // \W - One character that is not a word character
  // \S - One character that is not a whitespace character
  // . - any character except line break
  // \. - A period (needs to be separated by \)
  // \ - escapes a special character


  //                          QUANTIFIERS

  // + - One or more
  // {3} - Exactly 3 times
  // {2,4} - 3 to 4 times (exclude 2)
  // {3,} - 3 or more times
  // * - 0 or more times
  // ? - once or none

  //                           LOGIC

  // | - OR operand
  // ( ..) Capturing groups
  // \1 Contents of group 1
  // \2 Contents of group 2
  //  (?: ... ) - Non-Capturing group

  //                          ANCHORS AND BOUNDARIES

  //  ^ - start of string
  //  $ - end of string
  //  \A - beginning of string
  //  \z  - very end of string
  //  \b - word boundary

  //   NOTE:
  // all regex should be encompassed in /  / matching slants
  // refer to documentation for super specific use-cases, I used rexegg.com

  const [errors, setErrors] = useState({});

  const FormValidation = () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // regex --> "[^\s@]" or ensures something before @ symbol
    //                  + 
    //           "@[^\s@]" that ensures an @ in there, then ensure something after @ until a dot .
    //                  +
    //           "\.[^\s@]" a dot (any char in regex) then one or more char after dot, 
    //                  +
    //            then "$/" end of string 

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // regex ensures at least 8 chars, 1 uppercase, 1 number, and 1 special character
    

    let newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!username.trim()) newErrors.username = "Username is required.";
    if (!emailRegex.test(email)) newErrors.email = "Enter a valid email address.";
    if (!passwordRegex.test(password))
      newErrors.password = "Password must be 8+ characters, contain 1 uppercase, 1 number, and 1 special character.";

    setErrors(newErrors); // update the state with errors after^^ can't do individual
    return Object.keys(newErrors).length === 0; // return true if no errors, move on to submit
  };

  // form submission handler -> to be connected to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (FormValidation()) { // temporary check to see if form submits without backend, REMOVE LATER
      console.log("Form submitted successfully!");
    }

    // TODO: Implement registration logic here
    // backend expects: { firstname, lastname, email, username, password }
    const newUser = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      username: username,
      password: password
    };
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if(res.ok) {
        alert("Registration successful!");
        //localStorage.setItem("token", data.token);
        window.location.href = "/";
      }
      else{
        alert("Registration failed.");
      }
    }
    catch (err) {
      console.error("Registration error: ", err);
      alert("There was an issue. Please try again.");
    }
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

            {/* first name input group with icon, existing error above container */}
            {errors.firstName && <p className="error-text">{errors.firstName}</p>} 
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

            {/* last name input group with icon, existing error above container */}
            {errors.lastName && <p className="error-text">{errors.lastName}</p>} 
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

            {/* email input group with icon, existing error above container */}
            {errors.email && <p className="error-text">{errors.email}</p>} 
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

            {/* username input group with icon, existing error above container */}
            {errors.username && <p className="error-text">{errors.username}</p>} 
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

            {/* password input group with icon, existing error above container */}
            {errors.password && <p className="error-text">{errors.password}</p>}
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
