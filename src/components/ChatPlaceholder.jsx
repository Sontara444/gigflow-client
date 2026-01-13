import { MessageSquare } from 'lucide-react';

const ChatPlaceholder = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-slate-900/50">
            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                <MessageSquare className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Select a Conversation</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                Choose a chat from the sidebar to start messaging or search for a user to connect with.
            </p>
        </div>
    );
};

export default ChatPlaceholder;
