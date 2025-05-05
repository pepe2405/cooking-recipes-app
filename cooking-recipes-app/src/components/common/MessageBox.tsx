import React from 'react';
interface MessageBoxProps {
    message: string;
    type: 'info' | 'error' | 'success' | 'warning';
}
const MessageBox: React.FC<MessageBoxProps> = ({ message, type = 'info' }) => {
    const baseClasses = "px-4 py-3 rounded relative border";
    const typeClasses = {
        info: "bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300",
        error: "bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300",
        success: "bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300",
        warning: "bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]} max-w-xl mx-auto`} role="alert">
            <span className="block sm:inline">{message}</span>
        </div>
    );
};
export default MessageBox;