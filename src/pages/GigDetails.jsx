import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import BidItem from '../components/BidItem';
import { ArrowLeft, Clock, User, CheckCircle, Shield, Calendar } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const GigDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const [gig, setGig] = useState(null);
    const [bids, setBids] = useState([]);
    const [message, setMessage] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(true);
    const [myBid, setMyBid] = useState(null);

    useEffect(() => {
        const fetchGig = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/gigs/${id}`);
                setGig(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchGig();
    }, [id]);

    useEffect(() => {
        if (userInfo && gig && gig.ownerId._id !== userInfo._id) {
            const checkMyBid = async () => {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bids/my-bid/${id}`, { withCredentials: true });
                    setMyBid(res.data);
                } catch (err) {
                    console.error('Error checking bid status', err);
                }
            };
            checkMyBid();
        }
    }, [id, gig, userInfo]);

    const socket = useSocket();

    useEffect(() => {
        if (gig && userInfo && gig.ownerId._id === userInfo._id) {
            const fetchBids = async () => {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bids/${id}`, { withCredentials: true });
                    setBids(res.data);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchBids();
        }
    }, [gig, userInfo, id]);

    useEffect(() => {
        if (socket) {
            const handleHireUpdate = (data) => {
                if (data.gigId === id) {
                    setGig((prev) => ({ ...prev, status: 'assigned' }));

                    setMyBid((prev) => prev ? { ...prev, status: 'hired' } : prev);
                }
            };

            socket.on('hire_notification', handleHireUpdate);

            return () => {
                socket.off('hire_notification', handleHireUpdate);
            };
        }
    }, [socket, id]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();

        if (Number(price) > gig.budget) {
            return toast.error('Bid cannot exceed project budget');
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/bids`,
                { gigId: id, message, price },
                { withCredentials: true }
            );
            toast.success('Bid submitted successfully!');
            setMessage('');
            setPrice('');
            setMyBid(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const handleHire = async (bidId) => {
        if (window.confirm('Are you sure you want to hire this freelancer?')) {
            try {
                await axios.patch(`${import.meta.env.VITE_API_URL}/api/bids/${bidId}/hire`, {}, { withCredentials: true });
                window.location.reload();
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div></div>;
    if (!gig) return <p className="text-center mt-10 dark:text-white">Gig not found</p>;

    const isOwner = userInfo && gig.ownerId._id === userInfo._id;

    return (
        <div className="max-w-6xl mx-auto mt-8 px-6 pb-20">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                        <div className="mb-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${gig.status === 'open'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50'
                                : 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50'
                                }`}>
                                {gig.status === 'open' ? <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> : <CheckCircle className="w-3 h-3" />}
                                {gig.status}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            {gig.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Posted By</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{gig.ownerId.name || 'Unknown User'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Posted On</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{new Date(gig.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Project Description</h3>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                            <p className="whitespace-pre-line">{gig.description}</p>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Proposals</h2>
                                <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 text-xs font-bold px-3 py-1 rounded-full">
                                    {bids.length} Applicants
                                </span>
                            </div>

                            {bids.length === 0 ? (
                                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">No proposals yet.</p>
                                    <p className="text-sm text-slate-400 mt-1">Check back later for applicants.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bids.map((bid) => (
                                        <BidItem key={bid._id} bid={bid} onHire={handleHire} isOwner={true} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 sticky top-6">
                        <div className="mb-6">
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Project Budget</p>
                            <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                                ${gig.budget}
                            </div>
                        </div>

                        {!isOwner && (
                            <>
                                {myBid ? (
                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${myBid.status === 'hired' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            myBid.status === 'rejected' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                            }`}>
                                            {myBid.status === 'hired' ? <CheckCircle className="w-8 h-8" /> :
                                                myBid.status === 'rejected' ? <Shield className="w-8 h-8" /> :
                                                    <Clock className="w-8 h-8" />}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                            {myBid.status === 'hired' ? 'Proposal Accepted!' :
                                                myBid.status === 'rejected' ? 'Proposal Declined' :
                                                    'Proposal Submitted'}
                                        </h3>
                                        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-medium mb-4">
                                            Status: <span className="uppercase">{myBid.status}</span>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                                            {myBid.status === 'pending'
                                                ? "We've sent your proposal to the client. You'll be notified if they're interested."
                                                : "Check your dashboard for more details."}
                                        </p>
                                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4 text-left">
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold">Your Price</p>
                                                <p className="font-semibold dark:text-white">${myBid.price}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold">Sent</p>
                                                <p className="font-semibold dark:text-white">{new Date(myBid.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {gig.status === 'open' ? (
                                            <form onSubmit={handleBidSubmit} className="space-y-4">
                                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Submit Proposal</h3>

                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Your Price ($)</label>
                                                        <input
                                                            type="number"
                                                            value={price}
                                                            onChange={(e) => setPrice(e.target.value)}
                                                            className="w-full h-11 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                                            placeholder="Enter amount"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Cover Letter</label>
                                                        <textarea
                                                            value={message}
                                                            onChange={(e) => setMessage(e.target.value)}
                                                            className="w-full p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition h-32 resize-none text-sm"
                                                            placeholder="Describe why you're the best fit..."
                                                            required
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]"
                                                    >
                                                        Send Proposal
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 text-center">
                                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600 dark:text-blue-400">
                                                    <Shield className="w-6 h-6" />
                                                </div>
                                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Project Assigned</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Applications are closed.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                <span>Payment Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GigDetails;
