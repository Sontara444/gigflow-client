import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { LogOut, PlusCircle, User, Briefcase, Moon, Sun, Menu, X, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';
import { useNotifications } from '../context/NotificationContext';

const Navbar = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { unreadMessageCount } = useNotifications() || {};
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleLogout = async () => {
        dispatch(logout());
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path
            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
            : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/5";
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 shadow-sm transition-colors duration-300">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight hover:opacity-80 transition">
                        <Briefcase className="w-8 h-8" />
                        <span>GigFlow</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>

                        {userInfo ? (
                            <>
                                <Link
                                    to="/gigs"
                                    className={`flex items-center gap-2 font-medium transition px-4 py-2 rounded-full ${isActive('/gigs')}`}
                                >
                                    <Briefcase className="w-4 h-4" />
                                    Browse Gigs
                                </Link>

                                <Link
                                    to="/my-projects"
                                    className={`flex items-center gap-2 font-medium transition px-4 py-2 rounded-full ${isActive('/my-projects')}`}
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    to="/create-gig"
                                    className={`flex items-center gap-2 font-medium transition px-4 py-2 rounded-full ${isActive('/create-gig')}`}
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Post a Gig
                                </Link>

                                <Link
                                    to="/chats"
                                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition relative ${isActive('/chats')}`}
                                    title="Messages"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    {unreadMessageCount > 0 && !location.pathname.startsWith('/chats') && (
                                        <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0B0F19]"></span>
                                    )}
                                </Link>

                                <NotificationDropdown />

                                <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-white/10">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{userInfo.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{userInfo.email}</span>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-white/10">
                                        {userInfo.name.charAt(0).toUpperCase()}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">Login</Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        <NotificationDropdown />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-600 dark:text-gray-300"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden pt-4 pb-20 animate-fade-in">
                        <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5">
                            {userInfo ? (
                                <>
                                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-white/5">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                            {userInfo.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{userInfo.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{userInfo.email}</p>
                                        </div>
                                    </div>

                                    <Link to="/gigs" className={`flex items-center gap-3 p-3 rounded-xl font-medium ${isActive('/gigs')}`}>
                                        <Briefcase className="w-5 h-5" /> Browse Gigs
                                    </Link>
                                    <Link to="/my-projects" className={`flex items-center gap-3 p-3 rounded-xl font-medium ${isActive('/my-projects')}`}>
                                        <User className="w-5 h-5" /> Dashboard
                                    </Link>
                                    <Link to="/create-gig" className={`flex items-center gap-3 p-3 rounded-xl font-medium ${isActive('/create-gig')}`}>
                                        <PlusCircle className="w-5 h-5" /> Post a Gig
                                    </Link>
                                    <Link to="/chats" className={`flex items-center gap-3 p-3 rounded-xl font-medium ${isActive('/chats')}`}>
                                        <MessageSquare className="w-5 h-5" /> Messages
                                    </Link>

                                    <div className="h-px bg-gray-100 dark:bg-white/5 my-2"></div>

                                    <button
                                        onClick={toggleTheme}
                                        className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                    >
                                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 p-3 rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                                    >
                                        <LogOut className="w-5 h-5" /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link to="/login" className="w-full text-center py-3 rounded-xl font-bold bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white">Login</Link>
                                    <Link to="/register" className="w-full text-center py-3 rounded-xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">Get Started</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
