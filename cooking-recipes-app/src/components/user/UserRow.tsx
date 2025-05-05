import React from 'react';
import { Link } from 'react-router-dom';
import { User, UserRole, AccountStatus } from '../../models/User';
import { format } from 'date-fns';

interface UserRowProps {
    user: User;
    currentUser: User | null;
    onDelete: (userId: string, username: string) => void;
}

const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
        case AccountStatus.ACTIVE:
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Активен</span>;
        case AccountStatus.SUSPENDED:
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Спрян</span>;
        case AccountStatus.DEACTIVATED:
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Деактивиран</span>;
        default:
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Неизвестен</span>;
    }
};

const UserRow: React.FC<UserRowProps> = ({ user, currentUser, onDelete }) => {
    const canAdminModify = currentUser?.role === UserRole.ADMIN && currentUser.id !== user.id;

    const handleDeleteClick = () => {
        onDelete(user.id, user.username);
    };

    const formattedRegDate = format(new Date(user.registrationDate), 'dd.MM.yyyy');

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.pictureUrl || (user.gender === 'female' ? '/default-avatar-female.png' : '/default-avatar-male.png')}
                            alt={`${user.name}'s avatar`}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/default-avatar-male.png';
                            }}
                        />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.username}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {user.role === UserRole.ADMIN ? 'Администратор' : 'Потребител'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(user.status)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                {formattedRegDate}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {canAdminModify && (
                    <div className="flex justify-end space-x-2">
                        <Link
                            to={`/edit-user/${user.id}`}
                            className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-100 dark:hover:bg-gray-700"
                            title="Редактирай потребител"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <button
                            onClick={handleDeleteClick}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-100 dark:hover:bg-gray-700"
                            title="Изтрий потребител"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default UserRow;
