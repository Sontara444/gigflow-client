import { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from './SocketContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0); // For system notifications
    const [unreadMessageCount, setUnreadMessageCount] = useState(0); // For chat messages
    const { userInfo } = useSelector((state) => state.auth);
    const socket = useSocket();

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`, {
                withCredentials: true,
            });
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const fetchUnreadMessageCount = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages`, {
                withCredentials: true,
            });
            // Count conversations with unread messages
            const count = data.filter(chat => chat.unread).length;
            setUnreadMessageCount(count);
        } catch (error) {
            console.error('Failed to fetch unread messages', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`, {}, {
                withCredentials: true,
            });
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`, {}, {
                withCredentials: true,
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    useEffect(() => {
        if (userInfo) {
            fetchNotifications();
            fetchUnreadMessageCount();
        } else {
            setNotifications([]);
            setUnreadCount(0);
            setUnreadMessageCount(0);
        }
    }, [userInfo]);

    useEffect(() => {
        if (socket && userInfo) {
            console.log('NotificationContext: Socket connected, setting up listeners');
            const handleHireNotification = (data) => {


                if (data.notification) {
                    setNotifications(prev => [data.notification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                } else {
                    fetchNotifications();
                }

                toast.success(data.message, {
                    duration: 5000,
                    position: 'top-right',
                    style: {
                        background: '#10b981',
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                });
            };

            const handleReceiveMessage = (message) => {
                console.log('NotificationContext: Received message', message);

                // Refresh unread count whenever a new message arrives
                fetchUnreadMessageCount();

                // Don't show notification if we are on the chat page with this user
                const currentPath = window.location.pathname;
                const senderId = message.sender._id || message.sender; // Handle both populated and unpopulated just in case

                // Check if the URL contains the sender's ID (handling both /chats/ and /chat/ for safety)
                const isChattingWithSender = currentPath.includes(`/chats/${senderId}`) || currentPath.includes(`/chat/${senderId}`);

                if (!isChattingWithSender) {
                    toast((t) => (
                        <div
                            onClick={() => {
                                toast.dismiss(t.id);
                                window.location.href = `/chats/${senderId}`;
                            }}
                            className="cursor-pointer"
                        >
                            <p className="font-bold text-sm">New message from {message.sender.name || 'User'}</p>
                            <p className="text-xs truncate max-w-[200px]">{message.content}</p>
                        </div>
                    ), {
                        duration: 5000,
                        position: 'top-right',
                        style: {
                            background: '#fff',
                            color: '#333',
                            borderLeft: '4px solid #6366f1',
                            cursor: 'pointer',
                        },
                        icon: '💬',
                    });
                }
            };

            socket.on('hire_notification', handleHireNotification);
            socket.on('receive_message', handleReceiveMessage);

            return () => {
                socket.off('hire_notification', handleHireNotification);
                socket.off('receive_message', handleReceiveMessage);
            };
        }
    }, [socket, userInfo]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, unreadMessageCount, fetchUnreadMessageCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
