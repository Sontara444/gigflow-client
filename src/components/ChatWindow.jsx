import { useState, useEffect, useRef } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useNotifications } from '../context/NotificationContext';
import { Send, User, MoreVertical, Phone, Video, Check, CheckCheck } from 'lucide-react';

const ChatWindow = () => {
    const { userId } = useParams();
    const { userInfo } = useSelector((state) => state.auth);
    const socket = useSocket();
    const { fetchUnreadMessageCount } = useNotifications() || {};

    // We can receive a refreshConversations function from the layout if needed, 
    // but for now we'll just handle local state.
    const { onMessageSent } = useOutletContext() || {};

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipient, setRecipient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matchedGig, setMatchedGig] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchMessagesAndMatch = async () => {
            setLoading(true);
            try {
                const [msgsRes, matchRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${userId}`, { withCredentials: true }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/gigs/matches/${userId}`, { withCredentials: true })
                ]);

                setMessages(msgsRes.data);
                if (matchRes.data && matchRes.data.length > 0) {
                    setMatchedGig(matchRes.data[0]);
                } else {
                    setMatchedGig(null);
                }

                // Infer recipient details
                if (msgsRes.data.length > 0) {
                    const otherUser = msgsRes.data[0].sender._id === userInfo._id ? msgsRes.data[0].recipient : msgsRes.data[0].sender;
                    setRecipient(otherUser);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (userId) {
            fetchMessagesAndMatch();
        }
    }, [userId, userInfo._id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            if (message.sender._id === userId || message.sender === userId) {
                setMessages((prev) => [...prev, message]);
                scrollToBottom();

                // Mark this new message as read immediately since we are viewing the chat
                try {
                    axios.put(`${import.meta.env.VITE_API_URL}/api/messages/read/${userId}`, {}, { withCredentials: true })
                        .then(() => {
                            if (onMessageSent) onMessageSent();
                            if (fetchUnreadMessageCount) fetchUnreadMessageCount();
                        });
                } catch (err) {
                    console.error(err);
                }
            }
        };

        const handleMessagesRead = ({ readerId }) => {
            if (readerId === userId) {
                setMessages(prev => prev.map(msg =>
                    (msg.sender._id === userInfo._id || msg.sender === userInfo._id) ? { ...msg, read: true } : msg
                ));
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('messages_read', handleMessagesRead);
        };
    }, [socket, userId, userInfo._id, onMessageSent, fetchUnreadMessageCount]);

    useEffect(() => {
        // Mark messages as read when opening the chat
        if (userId && messages.length > 0) {
            const hasUnread = messages.some(m => !m.read && (m.sender._id === userId || m.sender === userId));
            if (hasUnread) {
                axios.put(`${import.meta.env.VITE_API_URL}/api/messages/read/${userId}`, {}, { withCredentials: true })
                    .then(() => {
                        if (onMessageSent) onMessageSent();
                        if (fetchUnreadMessageCount) fetchUnreadMessageCount();
                    })
                    .catch(err => console.error(err));
            }
        }
    }, [userId, messages, onMessageSent, fetchUnreadMessageCount]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/messages`,
                { recipientId: userId, content: newMessage },
                { withCredentials: true }
            );

            setMessages((prev) => [...prev, res.data]);
            setNewMessage('');

            // Notify layout to update sidebar
            if (onMessageSent) onMessageSent();

        } catch (err) {
            console.error(err);
        }
    };

    if (!userId) return null;

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-slate-950 relative">
            {/* Header */}
            <div className="h-20 px-8 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm ring-2 ring-white dark:ring-slate-900">
                            {recipient?.avatar ? (
                                <img src={recipient.avatar} alt={recipient.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="w-6 h-6" />
                            )}
                        </div>
                        {recipient && (
                            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-0.5">
                            {recipient ? recipient.name : 'User'}
                        </h2>
                        {matchedGig ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project:</span>
                                <a href={`/gigs/${matchedGig._id}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                    {matchedGig.title}
                                </a>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${matchedGig.status === 'open' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                    matchedGig.status === 'assigned' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                    {matchedGig.status}
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Available for work</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scroll-smooth">
                {messages.map((msg, index) => {
                    const isMe = msg.sender._id === userInfo._id || msg.sender === userInfo._id;
                    return (
                        <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                <div className={`relative px-5 py-3.5 shadow-sm transition-all duration-200 ${isMe
                                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-sm shadow-indigo-200 dark:shadow-none'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700/50 shadow-slate-100 dark:shadow-none'
                                    }`}>
                                    <p className="text-[15px] leading-relaxed tracking-wide font-medium">{msg.content}</p>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1.5 px-1">
                                    <span className="text-[10px] font-semibold text-slate-400">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isMe && (
                                        msg.read ? (
                                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5" title="Read">
                                                <CheckCheck className="w-3.5 h-3.5" />
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 flex items-center gap-0.5" title="Delivered">
                                                <Check className="w-3.5 h-3.5" />
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60 sticky bottom-0 z-10">
                <form onSubmit={handleSendMessage} className="relative flex items-center gap-4 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-6 pr-14 py-4 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-[15px] shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95"
                    >
                        <Send className="w-5 h-5 translate-x-0.5 translate-y-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
