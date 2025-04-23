
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact'
import About from './pages/About'
import './App.css';


/**
 * main app component
 * handles routing and main application structure
 * login page is the default route for unauthenticated users
 * dashboard is temporarily set as default route for development
 */

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        {/* redirect any unknown routes to login */}
        <Route path="/dashboard" element={<Dashboard />} />
        // redirect unknown routes to dashboard
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;