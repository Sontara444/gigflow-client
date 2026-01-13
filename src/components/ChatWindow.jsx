import { useState, useEffect, useRef } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { Send, User, MoreVertical, Phone, Video } from 'lucide-react';

const ChatWindow = () => {
    const { userId } = useParams();
    const { userInfo } = useSelector((state) => state.auth);
    const socket = useSocket();

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
    }, [socket, userId, userInfo._id, onMessageSent]);

    useEffect(() => {
        // Mark messages as read when opening the chat
        if (userId && messages.length > 0) {
            const hasUnread = messages.some(m => !m.read && (m.sender._id === userId || m.sender === userId));
            if (hasUnread) {
                axios.put(`${import.meta.env.VITE_API_URL}/api/messages/read/${userId}`, {}, { withCredentials: true })
                    .then(() => {
                        if (onMessageSent) onMessageSent();
                    })
                    .catch(err => console.error(err));
            }
        }
    }, [userId, messages, onMessageSent]);

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
        <div className="flex flex-col h-full bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        {recipient?.avatar ? (
                            <img src={recipient.avatar} alt={recipient.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-white leading-tight">
                            {recipient ? recipient.name : 'User'}
                        </h2>
                        {matchedGig ? (
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-500">Related to:</span>
                                <a href={`/gigs/${matchedGig._id}`} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:text-indigo-700 underline flex items-center gap-1">
                                    {matchedGig.title}
                                </a>
                                <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-500 uppercase tracking-wide border border-slate-200 dark:border-slate-700">
                                    {matchedGig.status}
                                </span>
                            </div>
                        ) : recipient && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-xs text-slate-500 font-medium">Online</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-indigo-600 transition">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-indigo-600 transition">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-indigo-600 transition">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-black/5">
                {messages.map((msg, index) => {
                    const isMe = msg.sender._id === userInfo._id || msg.sender === userInfo._id;
                    return (
                        <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                <div className={`p-4 rounded-2xl shadow-sm ${isMe
                                    ? 'bg-indigo-600 text-white rounded-br-sm'
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 font-medium px-1">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 border focus:border-indigo-500 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
