import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { User, ArrowRight, MessageSquare } from 'lucide-react';

const ChatList = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages`, { withCredentials: true });
                setConversations(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div></div>;

    return (
        <div className="max-w-2xl mx-auto mt-8 px-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Messages</h1>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                {conversations.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <MessageSquare className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No messages yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">
                            Connect with others by browsing gigs or posting your own project.
                        </p>
                        <Link
                            to="/gigs"
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                        >
                            Browse Gigs <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {conversations.map((chat, index) => (
                            <Link
                                key={index}
                                to={`/chat/${chat.user._id}`}
                                className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate pr-4">{chat.user.name}</h3>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            {new Date(chat.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate pr-4 ${chat.unread ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
