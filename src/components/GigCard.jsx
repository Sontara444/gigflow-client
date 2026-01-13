import { Link } from 'react-router-dom';
import { User, Clock, DollarSign, Star } from 'lucide-react';

const GigCard = ({ gig }) => {
    return (
        <Link to={`/gigs/${gig._id}`} className="block group">
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800 p-1">
                <div className="flex flex-col md:flex-row p-5 gap-6">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${gig.status === 'open'
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
                                }`}>
                                {gig.status}
                            </span>
                            <div className="flex items-center text-xs text-gray-400">
                                <Clock className="w-3.5 h-3.5 mr-1" />
                                <span>Posted {new Date(gig.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-400">
                                {gig.bidCount || 0} bids
                            </span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {gig.title}
                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base line-clamp-2 md:line-clamp-2 mb-4 leading-relaxed">
                            {gig.description}
                        </p>

                        <div className="flex items-center gap-2 mt-auto">
                            <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <User className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {gig.ownerId?.name || 'User'}
                            </span>
                        </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:border-l border-gray-100 dark:border-slate-700 md:pl-6 md:min-w-[140px]">
                        <div className="text-right">
                            <span className="block text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold mb-1 hidden md:block">Budget</span>
                            <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-xl md:text-2xl">
                                <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
                                <span>{gig.budget}</span>
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <span className="inline-flex items-center justify-center w-full md:w-auto px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                View Details
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default GigCard;
