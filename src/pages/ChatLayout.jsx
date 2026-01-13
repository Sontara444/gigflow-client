import { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, Search, PlusCircle, MoreHorizontal } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const ChatLayout = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    useEffect(() => {
        fetchConversations();
    }, []);

    // Listen for new messages globally to update the sidebar list order/unread status
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = () => {
            fetchConversations();
        };

        socket.on('receive_message', handleNewMessage);
        return () => {
            socket.off('receive_message', handleNewMessage);
        };
    }, [socket]);

    const filteredConversations = conversations.filter(chat =>
        chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-80px)] max-w-7xl mx-auto p-4 md:p-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 h-full flex overflow-hidden">

                {/* Sidebar - Hidden on mobile if viewing chat */}
                <div className={`${userId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50`}>

                    {/* Sidebar Header */}
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Messages</h1>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition text-slate-500">
                                    <PlusCircle className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition text-slate-500">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MessageSquare className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">No conversations found</p>
                            </div>
                        ) : (
                            filteredConversations.map((chat) => (
                                <NavLink
                                    key={chat.user._id}
                                    to={`/chats/${chat.user._id}`}
                                    className={({ isActive }) => `
                                        flex items-start gap-4 p-3 rounded-xl transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700'
                                            : 'hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent'
                                        }
                                    `}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                            {chat.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        {/* Online indicator could go here */}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className={`font-bold truncate ${chat.unread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {chat.user.name}
                                            </h3>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {new Date(chat.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-sm truncate max-w-[140px] ${chat.unread ? 'text-slate-800 dark:text-slate-200 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {chat.lastMessage}
                                            </p>
                                            {chat.unread && (
                                                <span className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm shadow-indigo-500/40">
                                                    1
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </NavLink>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`${!userId ? 'hidden md:flex' : 'flex'} flex-col flex-1 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full`}>
                    <Outlet context={{ onMessageSent: fetchConversations }} />
                </div>
            </div>
        </div>
    );
};

export default ChatLayout;
