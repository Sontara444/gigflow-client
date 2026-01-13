import { useParams, Navigate } from 'react-router-dom';

const RedirectToChat = () => {
    const { userId } = useParams();
    return <Navigate to={`/chats/${userId}`} replace />;
};

export default RedirectToChat;
