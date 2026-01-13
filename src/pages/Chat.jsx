import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { Send, ArrowLeft, User } from 'lucide-react';

const Chat = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const socket = useSocket();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipient, setRecipient] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${userId}`, { withCredentials: true });
                setMessages(res.data);

                // Infer recipient from the first message if possible, or fetch detailed user info if needed
                // For simplicity, we'll try to get it from the messages if existing
                if (res.data.length > 0) {
                    const otherUser = res.data[0].sender._id === userInfo._id ? res.data[0].recipient : res.data[0].sender;
                    setRecipient(otherUser);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchMessages();
    }, [userId, userInfo]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            if (message.sender._id === userId || message.sender === userId) {
                setMessages((prev) => [...prev, message]);
            }
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, userId]);

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
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4 h-[calc(100vh-140px)] flex flex-col">
            <div className="bg-white dark:bg-slate-900 rounded-t-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm z-10">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-white">
                            {recipient ? recipient.name : 'Start a conversation'}
                        </h2>
                        {recipient && <p className="text-xs text-slate-500 dark:text-slate-400">{recipient.email}</p>}
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-slate-50 dark:bg-black/20 overflow-y-auto p-4 space-y-4 border-x border-slate-200 dark:border-slate-800">
                {messages.map((msg, index) => {
                    const isMe = msg.sender._id === userInfo._id || msg.sender === userInfo._id;
                    return (
                        <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-2xl ${isMe
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                                }`}>
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
