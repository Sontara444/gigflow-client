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
    const [unreadCount, setUnreadCount] = useState(0);
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
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [userInfo]);

    useEffect(() => {
        if (socket && userInfo) {
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

            socket.on('hire_notification', handleHireNotification);

            return () => {
                socket.off('hire_notification', handleHireNotification);
            };
        }
    }, [socket, userInfo]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
