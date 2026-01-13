import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyProjects from './pages/MyProjects';
import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import { ThemeProvider } from './context/ThemeContext';
import { useSocket } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  const socket = useSocket();


  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            <Toaster />
            <main className="container mx-auto p-4">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/gigs" element={<Dashboard />} />
                <Route path="/create-gig" element={<PrivateRoute><CreateGig /></PrivateRoute>} />
                <Route path="/my-projects" element={<PrivateRoute><MyProjects /></PrivateRoute>} />
                <Route path="/gigs/:id" element={<PrivateRoute><GigDetails /></PrivateRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
