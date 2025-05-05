import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsers, deleteUser } from '../services/userService';
import { User, UserRole } from '../models/User';
import { useAuth } from '../hooks/useAuth';
import UserRow from '../components/user/UserRow';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MessageBox from '../components/common/MessageBox';

const UsersListPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setDeleteError(null);
        setDeleteSuccess(null);
        try {
            const fetchedUsers = await getAllUsers();
            setUsers(fetchedUsers);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError(err instanceof Error ? err.message : 'Неуспешно зареждане на потребителите.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteUser = async (userId: string, username: string) => {
        setDeleteError(null);
        setDeleteSuccess(null);

        if (!window.confirm(`Сигурни ли сте, че искате да изтриете потребител ${username}? Това действие е необратимо!`)) {
            return;
        }

        if (currentUser?.id === userId) {
            setDeleteError("Не можете да изтриете собствения си акаунт.");
            return;
        }

        try {
            await deleteUser(userId);
            setDeleteSuccess(`Потребител ${username} беше изтрит успешно.`);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        } catch (err) {
            console.error("Error deleting user:", err);
            setDeleteError(err instanceof Error ? err.message : 'Грешка при изтриване на потребител.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Списък с Потребители</h1>

            {isLoading && <LoadingSpinner />}
            {error && <MessageBox type="error" message={error} />}
            {deleteError && <MessageBox type="error" message={deleteError} />}
            {deleteSuccess && <MessageBox type="success" message={deleteSuccess} />}

            {!isLoading && !error && (
                <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Потребител</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Роля</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Регистриран на</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Действия</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                            {users.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    currentUser={currentUser}
                                    onDelete={handleDeleteUser}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
             {users.length === 0 && !isLoading && !error && (
                 <MessageBox type="info" message="Няма регистрирани потребители." />
             )}
        </div>
    );
};

export default UsersListPage;

