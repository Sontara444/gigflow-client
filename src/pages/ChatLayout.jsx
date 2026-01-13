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
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 h-full flex overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800">

                {/* Sidebar - Hidden on mobile if viewing chat */}
                <div className={`${userId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-slate-100 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950`}>

                    {/* Sidebar Header */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Messages</h1>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white dark:hover:bg-slate-900 rounded-full transition-all text-slate-400 hover:text-indigo-600 shadow-sm hover:shadow-md border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                    <PlusCircle className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-white dark:hover:bg-slate-900 rounded-full transition-all text-slate-400 hover:text-indigo-600 shadow-sm hover:shadow-md border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="relative group">
                            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm group-focus-within:shadow-md"
                            />
                        </div>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MessageSquare className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No conversations found</p>
                            </div>
                        ) : (
                            filteredConversations.map((chat) => (
                                <NavLink
                                    key={chat.user._id}
                                    to={`/chats/${chat.user._id}`}
                                    className={({ isActive }) => `
                                        flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
                                        ${isActive
                                            ? 'bg-white dark:bg-slate-900 shadow-lg shadow-indigo-100/50 dark:shadow-none border border-indigo-100 dark:border-indigo-900/30'
                                            : 'hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-md border border-transparent'
                                        }
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></div>}

                                            <div className="relative flex-shrink-0">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white dark:ring-slate-800">
                                                    {chat.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className={`font-bold truncate text-[15px] ${chat.unread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'} ${isActive ? 'text-indigo-900 dark:text-white' : ''}`}>
                                                        {chat.user.name}
                                                    </h3>
                                                    <span className={`text-[10px] font-medium ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}>
                                                        {new Date(chat.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className={`text-xs truncate max-w-[140px] ${chat.unread ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 font-medium'} ${isActive ? 'text-indigo-600/80 dark:text-indigo-300/80' : ''}`}>
                                                        {chat.unread ? 'New Message' : chat.lastMessage}
                                                    </p>
                                                    {chat.unread && (
                                                        <span className="min-w-[1.25rem] h-5 px-1.5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm shadow-indigo-500/40 animate-pulse">
                                                            !
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </NavLink>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`${!userId ? 'hidden md:flex' : 'flex'} flex-col flex-1 bg-white dark:bg-slate-900 h-full relative z-0`}>
                    <Outlet context={{ onMessageSent: fetchConversations }} />
                </div>
            </div>
        </div>
    );
};

export default ChatLayout;
