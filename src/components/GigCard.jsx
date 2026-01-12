import { Link } from 'react-router-dom';
import { User, Clock, DollarSign, Star } from 'lucide-react';

const GigCard = ({ gig }) => {
    return (
        <Link to={`/gigs/${gig._id}`} className="block group">
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${gig.status === 'open'
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                            }`}>
                            {gig.status}
                        </span>
                        <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold">
                            <DollarSign className="w-4 h-4 mr-0.5" />
                            <span>{gig.budget}</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {gig.title}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                        {gig.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700 mt-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                                {gig.ownerId?.name || 'User'}
                            </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {new Date(gig.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default GigCard;
