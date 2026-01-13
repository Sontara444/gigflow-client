import { useState, useEffect } from 'react';
import axios from 'axios';
import GigCard from '../components/GigCard';
import { Search } from 'lucide-react';

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
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0F19] transition-colors duration-500 overflow-x-hidden selection:bg-indigo-500/30">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px] dark:opacity-20"></div>
                <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-500 opacity-20 blur-[120px] dark:opacity-10"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12 flex-grow">
                <div className="max-w-4xl mx-auto mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                        Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Opportunity</span>
                    </h1>

                    <div className="relative group max-w-2xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative flex items-center w-full h-16 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl transition-all duration-300 group-hover:translate-y-[-2px]">
                            <div className="pl-6 pointer-events-none">
                                <Search className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                            </div>

                            <input
                                type="text"
                                className="w-full h-full py-4 pl-4 pr-6 text-lg text-slate-900 dark:text-gray-100 bg-transparent outline-none placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                                placeholder="Search for gigs (e.g., 'React', 'Design', 'Writer')..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-end mb-8 px-2 border-b border-indigo-100 dark:border-white/5 pb-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 flex items-center gap-3">
                            Latest Gigs
                            {!loading && (
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                                    {gigs.length}
                                </span>
                            )}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-500"></div>
                        </div>
                    ) : gigs.length === 0 ? (
                        <div className="text-center py-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 transition-all duration-300">
                            <div className="mx-auto w-20 h-20 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Search className="w-10 h-10 text-indigo-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No gigs found</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                We couldn't find any gigs matching "{search}". Try searching for something else.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {gigs.map((gig) => (
                                <div key={gig._id} className="animate-fade-in-up">
                                    <GigCard gig={gig} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
