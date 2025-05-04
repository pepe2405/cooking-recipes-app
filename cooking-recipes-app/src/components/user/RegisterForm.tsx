import React, { useState } from 'react';
import { User, Gender } from '../../models/User';
import { registerUser } from '../../services/userService';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {}

const RegisterForm: React.FC<RegisterFormProps> = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        gender: Gender.OTHER,
        pictureUrl: '',
        bio: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Паролите не съвпадат.');
            return;
        }

        const userData = {
            name: formData.name,
            username: formData.username,
            password: formData.password,
            gender: formData.gender,
            pictureUrl: formData.pictureUrl,
            bio: formData.bio,
        };

        setIsLoading(true);
        try {
            const newUser = await registerUser(userData);
            setSuccess(`Успешна регистрация за ${newUser.username}! Вече можете да влезете.`);
            setFormData({
                name: '',
                username: '',
                password: '',
                confirmPassword: '',
                gender: Gender.OTHER,
                pictureUrl: '',
                bio: '',
            });
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Възникна неочаквана грешка.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Регистрация</h2>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{success}</div>}

            {/* Name Input */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Име:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Username Input */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Потребителско име:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    maxLength={15}
                    pattern="\w+"
                    title="До 15 символа, само букви, цифри и долна черта."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Password Input */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Парола:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    title="Поне 8 символа, с поне една цифра и един специален знак."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

             {/* Confirm Password Input */}
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Потвърди парола:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Gender Select */}
            <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Пол:</label>
                <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value={Gender.FEMALE}>Жена</option>
                    <option value={Gender.MALE}>Мъж</option>
                    <option value={Gender.OTHER}>Друг</option>
                </select>
            </div>

            {/* Picture URL Input (Optional) */}
            <div>
                <label htmlFor="pictureUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL на снимка (опционално):</label>
                <input
                    type="url"
                    id="pictureUrl"
                    name="pictureUrl"
                    value={formData.pictureUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.png"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

             {/* Bio Textarea (Optional) */}
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Кратко представяне (опционално):</label>
                <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    maxLength={512}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Submit Button */}
            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isLoading ? 'Регистриране...' : 'Регистрирай се'}
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;