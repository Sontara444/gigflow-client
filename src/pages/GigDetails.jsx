import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BidItem from '../components/BidItem';
import { ArrowLeft, Clock, User, CheckCircle } from 'lucide-react';
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

    // Listen for real-time hire notifications to update UI instantly
    useEffect(() => {
        if (socket) {
            socket.on('hire_notification', (data) => {
                if (data.gigId === id || (gig && data.gigId === gig._id)) {
                    setGig((prev) => ({ ...prev, status: 'assigned' }));
                }
            });

            return () => {
                socket.off('hire_notification');
            };
        }
    }, [socket, id, gig]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/bids`,
                { gigId: id, message, price },
                { withCredentials: true }
            );
            alert('Bid submitted successfully!');
            setMessage('');
            setPrice('');
        } catch (err) {
            alert(err.response?.data?.message || err.message);
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
        <div className="max-w-5xl mx-auto mt-6 px-4 pb-20">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition"
            >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Gig Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{gig.title}</h1>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${gig.status === 'open' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                                {gig.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-600 dark:text-slate-300 mb-8 leading-relaxed whitespace-pre-line">
                            {gig.description}
                        </div>

                        <div className="flex items-center gap-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <User className="w-5 h-5" />
                                <span className="font-medium">{gig.ownerId.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Clock className="w-5 h-5" />
                                <span>Posted {new Date(gig.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bids Section */}
                    {isOwner && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                                Bids Received
                                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm px-2 py-1 rounded-full">{bids.length}</span>
                            </h2>
                            {bids.length === 0 ? (
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center border-dashed border-2 border-gray-200 dark:border-slate-700 transition-colors duration-300">
                                    <p className="text-gray-500 dark:text-gray-400">No bids received yet. Relax and wait for talent!</p>
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

                {/* Right: Budget & Action */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 sticky top-24 transition-colors duration-300">
                        <div className="text-center mb-6">
                            <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Project Budget</p>
                            <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">${gig.budget}</p>
                        </div>

                        {!isOwner && (
                            <div className="mt-8">
                                {gig.status === 'open' ? (
                                    <form onSubmit={handleBidSubmit} className="space-y-4">
                                        <h3 className="font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2 mb-4">Submit a Proposal</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bid Amount ($)</label>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-200 outline-none"
                                                placeholder="Your price"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Letter</label>
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-200 outline-none h-32 resize-none"
                                                placeholder="Why should they hire you?"
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg">
                                            Send Proposal
                                        </button>
                                    </form>
                                ) : (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl text-center text-blue-800 dark:text-blue-300">
                                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-blue-500 dark:text-blue-400" />
                                        <h3 className="font-bold text-lg">Position Filled</h3>
                                        <p className="text-sm opacity-80 mt-1">This gig has been assigned to a freelancer.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GigDetails;
