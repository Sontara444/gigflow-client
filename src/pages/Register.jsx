import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register',
                { name, email, password },
                { withCredentials: true }
            );
            dispatch(setCredentials(res.data));
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="flex w-full max-w-5xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden m-4 h-[700px] transition-colors duration-300">
                {/* Left Side - Image/Gradient */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 to-pink-600 text-white flex-col justify-center p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Join GigFlow</h2>
                        <p className="text-purple-100 text-lg leading-relaxed">
                            Create an account to start posting jobs or bidding on exciting freelance projects.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center overflow-y-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Get started for free</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                placeholder="Min 6 characters"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                placeholder="Confirm password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-purple-700 hover:shadow-xl transition flex justify-center items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Register'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
