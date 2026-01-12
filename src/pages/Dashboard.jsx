import { useState, useEffect } from 'react';
import axios from 'axios';
import GigCard from '../components/GigCard';
import { Search, Sparkles } from 'lucide-react';

const Dashboard = () => {
    const [gigs, setGigs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchGigs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/gigs?search=${search}`);
            setGigs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchGigs();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <div className="relative bg-indigo-900 dark:bg-slate-800 text-white rounded-3xl p-10 mb-12 overflow-hidden shadow-2xl transition-colors duration-300">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-30"></div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-indigo-800/50 dark:bg-slate-700/50 rounded-full px-4 py-1.5 mb-6 border border-indigo-700 dark:border-slate-600">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-indigo-200 dark:text-indigo-100">The #1 Freelance Marketplace</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
                        Find the perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Freelance Gig</span>
                    </h1>
                    <p className="text-xl text-indigo-200 dark:text-slate-300 mb-10 leading-relaxed">
                        Connect with top clients or find skilled experts for your next big project. Secure, fast, and simple.
                    </p>

                    <div className="max-w-2xl mx-auto">
                        <div className="relative flex items-center w-full h-14 rounded-full bg-white/95 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-700 shadow-lg focus-within:shadow-xl focus-within:border-indigo-500 dark:focus-within:border-indigo-400 transition-all duration-300 ease-in-out">
                            <div className="pl-5 pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            </div>

                            <input
                                type="text"
                                className="w-full h-full py-4 pl-3 pr-4 text-gray-900 dark:text-gray-100 bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                                placeholder="Search for services..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <div className="pr-1.5 pt-0.5 pb-0.5 hidden sm:block">
                                <button className="h-11 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all duration-200 shadow-md hover:shadow-indigo-500/20 active:scale-95">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-8 px-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    Most Recent Gigs
                    <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-1 rounded-full">{gigs.length} available</span>
                </h2>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                </div>
            ) : gigs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-300 dark:border-slate-700 transition-colors duration-300">
                    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No gigs found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gigs.map((gig) => (
                        <GigCard key={gig._id} gig={gig} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
