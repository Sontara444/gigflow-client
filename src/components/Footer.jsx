import { Link } from 'react-router-dom';
import { Zap, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 border-t border-slate-100 dark:border-slate-900 mt-auto transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div>
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white mb-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-teal-900/20 flex items-center justify-center text-indigo-600 dark:text-teal-400">
                                <Zap className="w-5 h-5 fill-current transition-colors" />
                            </div>
                            <span>GigFlow</span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs text-slate-500 dark:text-slate-400">
                            Connect with top freelancers and find your next opportunity.
                            The modern marketplace for digital talent.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold mb-6">Platform</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/gigs" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Browse Gigs</Link></li>
                            <li><Link to="/create-gig" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Post a Gig</Link></li>
                            <li><Link to="/my-projects" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold mb-6">Support</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                    <p>
                        © {new Date().getFullYear()} GigFlow. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-pink-500 fill-current" />
                        <span>for freelancers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
