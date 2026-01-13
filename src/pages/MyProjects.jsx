import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Briefcase, List, Clock, CheckCircle, XCircle, FolderOpen, Send, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import GigCard from '../components/GigCard';

const MyProjects = () => {
    const [activeTab, setActiveTab] = useState('gigs');
    const [gigs, setGigs] = useState([]);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [gigsRes, bidsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/gigs/my-gigs`, { withCredentials: true }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/bids/my-bids`, { withCredentials: true })
                ]);

                setGigs(gigsRes.data);
                setBids(bidsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchData();
        }
    }, [userInfo]);

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 pb-20 relative">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <List className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 ml-11">Welcome back, {userInfo?.name}</p>
                </div>
                <Link to="/create-gig" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">
                    <FolderOpen className="w-4 h-4" />
                    Post a New Gig
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center group hover:border-indigo-500/50 transition duration-300">
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Posted Gigs</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{gigs.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                        <Briefcase className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center group hover:border-indigo-500/50 transition duration-300">
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Submitted Bids</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{bids.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                        <Send className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center group hover:border-indigo-500/50 transition duration-300">
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Hired</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{bids.filter(b => b.status === 'hired').length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-1">
                <button
                    onClick={() => setActiveTab('gigs')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-t-lg text-sm font-bold transition-all relative ${activeTab === 'gigs'
                        ? 'text-indigo-600 dark:text-indigo-400 after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Briefcase className="w-4 h-4" />
                    My Gigs ({gigs.length})
                </button>
                <button
                    onClick={() => setActiveTab('bids')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-t-lg text-sm font-bold transition-all relative ${activeTab === 'bids'
                        ? 'text-indigo-600 dark:text-indigo-400 after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <List className="w-4 h-4" />
                    My Bids ({bids.length})
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center mt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                </div>
            ) : (
                <div className="relative z-10">
                    {activeTab === 'gigs' ? (
                        gigs.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 text-center py-32 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
                                    <FolderOpen className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">No Gigs Posted Yet</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto text-base font-medium">Start looking for talent by posting your first gig today.</p>
                                <Link to="/create-gig" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">
                                    Post a New Gig
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {gigs.map((gig) => (
                                    <GigCard key={gig._id} gig={gig} />
                                ))}
                            </div>
                        )
                    ) : (
                        bids.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 text-center py-24 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-400">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Applications Yet</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto text-sm">Browse available gigs and start bidding!</p>
                                <Link to="/gigs" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold shadow-sm hover:bg-indigo-700 transition">Browse Gigs</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bids.map((bid) => (
                                    <div key={bid._id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition duration-200 flex flex-col h-full">
                                        <div className="mb-4">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">{bid.gigId?.title || 'Unknown Gig'}</h3>
                                            <div className="flex justify-between items-center mt-3">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bid Amount</span>
                                                <span className="text-lg font-bold text-slate-900 dark:text-white">${bid.price}</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-4 border border-slate-100 dark:border-slate-700 flex-grow">
                                            <p className="text-slate-600 dark:text-slate-300 italic text-sm line-clamp-3">"{bid.message}"</p>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 mt-auto border-t border-slate-100 dark:border-slate-800">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wide ${bid.status === 'hired'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50'
                                                : bid.status === 'rejected'
                                                    ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50'
                                                }`}>
                                                {bid.status === 'hired' && <CheckCircle className="w-3 h-3" />}
                                                {bid.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                {bid.status === 'pending' && <Clock className="w-3 h-3" />}
                                                {bid.status}
                                            </span>
                                            <span className="text-xs text-slate-400">{new Date(bid.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default MyProjects;
