import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Navbar from './components/Navbar';

import Landing from './pages/Landing';
import Drivers from './pages/Drivers';
import Riders from './pages/Riders';

import ChatPage from './pages/ChatPage';
import InboxPage from './pages/InboxPage';
import ReviewPage from './pages/ReviewPage';
import DriverReviews from './pages/DriverReviews';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landing" element={<Landing />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
        <Route path="/riders" element={<ProtectedRoute><Riders /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/chat/:postId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
        <Route path="/review/:postId" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
        <Route path="/driver/:driverId/reviews" element={<ProtectedRoute><DriverReviews /></ProtectedRoute>} />

        {/* Default to Landing if path not matched */}
        <Route path="*" element={<Navigate to="/landing" />} />
      </Routes>
    </Router>
  );
}

export default App;
