import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Gender, UserRole, AccountStatus } from '../../models/User';
import { updateUser } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import MessageBox from '../common/MessageBox';

interface UserFormProps {
    userToEdit: User;
    onUpdateSuccess?: (updatedUser: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ userToEdit, onUpdateSuccess }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(userToEdit.name);
    const [username, setUsername] = useState(userToEdit.username);
    const [gender, setGender] = useState(userToEdit.gender);
    const [role, setRole] = useState(userToEdit.role);
    const [status, setStatus] = useState(userToEdit.status);
    const [pictureUrl, setPictureUrl] = useState(userToEdit.pictureUrl || '');
    const [bio, setBio] = useState(userToEdit.bio || '');

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isAdmin = currentUser?.role === UserRole.ADMIN;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        const updatedUserData: Partial<User> = {
            name,
            gender,
            pictureUrl,
            bio,
            ...(isAdmin && { role }),
            ...(isAdmin && { status }),
        };

        try {
            const updatedUser = await updateUser(userToEdit.id, updatedUserData);
            setSuccess(`Потребител ${updatedUser.username} е обновен успешно.`);
            if (onUpdateSuccess) {
                onUpdateSuccess(updatedUser);
            }
            setTimeout(() => navigate('/users'), 1500);
        } catch (err) {
             if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Възникна неочаквана грешка при обновяване на потребителя.');
            }
             setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Редактиране на Потребител: {username}</h2>

            {error && <MessageBox type="error" message={error} />}
            {success && <MessageBox type="success" message={success} />}

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Име:</label>
                <input
                    type="text" id="name" name="name" value={name}
                    onChange={(e) => setName(e.target.value)} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Потребителско име:</label>
                <input
                    type="text" id="username" name="username" value={username} readOnly disabled
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-400 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Пол:</label>
                <select
                    id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value as Gender)} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value={Gender.FEMALE}>Жена</option>
                    <option value={Gender.MALE}>Мъж</option>
                    <option value={Gender.OTHER}>Друг</option>
                </select>
            </div>

            <div>
                <label htmlFor="pictureUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL на снимка:</label>
                <input
                    type="url" id="pictureUrl" name="pictureUrl" value={pictureUrl} onChange={(e) => setPictureUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Кратко представяне:</label>
                <textarea
                    id="bio" name="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={512} rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {isAdmin && (
                <>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Роля:</label>
                        <select
                            id="role" name="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value={UserRole.USER}>User</option>
                            <option value={UserRole.ADMIN}>Admin</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Статус:</label>
                        <select
                            id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value as AccountStatus)} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value={AccountStatus.ACTIVE}>Active</option>
                            <option value={AccountStatus.SUSPENDED}>Suspended</option>
                            <option value={AccountStatus.DEACTIVATED}>Deactivated</option>
                        </select>
                    </div>
                </>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                    {isLoading ? 'Запазване...' : 'Запази промените'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;

