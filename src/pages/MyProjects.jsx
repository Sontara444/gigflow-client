import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Briefcase, List, Clock, CheckCircle, XCircle, FolderOpen, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                if (activeTab === 'gigs') {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/gigs/my-gigs`, { withCredentials: true });
                    setGigs(res.data);
                } else {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bids/my-bids`, { withCredentials: true });
                    setBids(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchData();
        }
    }, [activeTab, userInfo]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 pb-20 relative">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Activity</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track your posted projects and applications.</p>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1 relative z-10 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <button
                        onClick={() => setActiveTab('gigs')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeTab === 'gigs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                    >
                        <FolderOpen className="w-4 h-4" />
                        Posted Gigs
                    </button>
                    <button
                        onClick={() => setActiveTab('bids')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeTab === 'bids' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                    >
                        <List className="w-4 h-4" />
                        My Applications
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center mt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                </div>
            ) : (
                <div className="relative z-10">
                    {activeTab === 'gigs' ? (
                        gigs.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 text-center py-24 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FolderOpen className="w-10 h-10 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Gigs Posted Yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Start looking for talent by posting your first gig today.</p>
                                <Link to="/create-gig" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition hover:-translate-y-0.5">Post a New Gig</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {gigs.map((gig) => (
                                    <Link key={gig._id} to={`/gigs/${gig._id}`} className="group bg-white dark:bg-slate-800 block p-6 rounded-2xl border border-gray-100 dark:border-slate-700 hover:shadow-xl transition duration-300 hover:border-indigo-500/30">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${gig.status === 'open'
                                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                                                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                                        }`}>
                                                        {gig.status}
                                                    </span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(gig.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{gig.title}</h3>
                                            </div>
                                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${gig.budget}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )
                    ) : (
                        bids.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 text-center py-24 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send className="w-10 h-10 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Applications Yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Browse available gigs and start bidding!</p>
                                <Link to="/" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition hover:-translate-y-0.5">Browse Gigs</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bids.map((bid) => (
                                    <div key={bid._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 hover:shadow-xl transition duration-300">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{bid.gigId?.title || 'Unknown Gig'}</h3>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Bid Amount</span>
                                                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">${bid.price}</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl mb-4 border border-gray-100 dark:border-slate-700/50">
                                            <p className="text-gray-600 dark:text-gray-300 italic text-sm line-clamp-2">"{bid.message}"</p>
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${bid.status === 'hired'
                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                                                : bid.status === 'rejected'
                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                                                    : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                                                }`}>
                                                {bid.status === 'hired' && <CheckCircle className="w-3 h-3" />}
                                                {bid.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                {bid.status === 'pending' && <Clock className="w-3 h-3" />}
                                                {bid.status.toUpperCase()}
                                            </span>
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
