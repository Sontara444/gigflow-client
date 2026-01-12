import { Link } from 'react-router-dom';
import { User, DollarSign, Clock } from 'lucide-react';

const GigCard = ({ gig }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
            {/* Header: Status and Budget */}
            <div className="flex justify-between items-start mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${gig.status === 'open'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                    {gig.status?.toUpperCase() || 'OPEN'}
                </span>
                <div className="flex items-center text-lg font-bold text-gray-900 dark:text-gray-100">
                    <DollarSign className="w-4 h-4 mr-1 text-indigo-500" />
                    {gig.budget?.toLocaleString()}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {gig.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 dark:text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                {gig.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-50 dark:border-slate-700 pt-4 mt-auto">
                <div className="flex items-center text-gray-400 text-xs font-medium">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mr-2 text-gray-500 dark:text-gray-400">
                        <User size={14} />
                    </div>
                    <span>{gig.ownerId?.name || 'Unknown'}</span>
                </div>

                <Link
                    to={`/gigs/${gig._id}`}
                    className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                    Details
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default GigCard;
