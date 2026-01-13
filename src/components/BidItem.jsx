import { Link } from 'react-router-dom';
import { Check, X, Clock, MessageSquare } from 'lucide-react';

const BidItem = ({ bid, onHire, isOwner }) => {
    return (
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${bid.status === 'hired'
            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
            : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:shadow-md'
            }`}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{bid.freelancerId.name}</h4>
                        <span className="text-xs text-gray-400">({bid.freelancerId.email})</span>
                    </div>

                    <p className="text-gray-600 dark:text-slate-300 mb-4 whitespace-pre-wrap">{bid.message}</p>

                    <div className="flex items-center gap-4 text-sm">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                            Bid: ${bid.price}
                        </span>
                        <span className={`font-semibold px-2 py-0.5 rounded ${bid.status === 'hired' ? 'text-green-700 dark:text-green-400' :
                            bid.status === 'rejected' ? 'text-red-500 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                            }`}>
                            {bid.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                {isOwner && bid.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                        <Link to={`/chat/${bid.freelancerId._id}`} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                            <MessageSquare className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={() => onHire(bid._id)}
                            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition flex items-center gap-2 shadow-lg shadow-gray-200/50 dark:shadow-none"
                        >
                            <Check className="w-4 h-4" />
                            Hire Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BidItem;
