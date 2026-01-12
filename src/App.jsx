import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Navbar />
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
