import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';

/**
 * main app component
 * handles routing and main application structure
 * currently set up with the login page as the home route
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* set Login as the home page */}
        <Route path="/" element={<Login />} />
        {/* additional routes can be added here as webapp grows */}
      </Routes>
    </Router>
  );
}

export default App;
