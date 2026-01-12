import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './context/ThemeContext';
import { useSocket } from './context/SocketContext';

function App() {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('hire_notification', (data) => {
        toast.success(data.message, {
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: 'bold',
          },
        });
      });

      return () => {
        socket.off('hire_notification');
      };
    }
  }, [socket]);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Navbar />
          <Toaster />
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/create-gig" element={<PrivateRoute><CreateGig /></PrivateRoute>} />
              <Route path="/gigs/:id" element={<PrivateRoute><GigDetails /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
