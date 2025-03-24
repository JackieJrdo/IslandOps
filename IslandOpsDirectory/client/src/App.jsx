import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

/**
 * main app component
 * handles routing and main application structure
 * login page is the default route
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Login is the default route */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
