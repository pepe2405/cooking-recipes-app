import React from 'react';
import { Link } from 'react-router-dom';
import { RecipeWithAuthor } from '../../services/recipeService';
import { User } from '../../models/User';
import LoadingSpinner from '../common/LoadingSpinner';
import MessageBox from '../common/MessageBox';

interface RecipeListProps {
    recipes: RecipeWithAuthor[];
    users: User[];
    isLoading: boolean;
    error: string | null;
    filterTag: string;
    filterAuthorId: string;
    onTagFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAuthorFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onDelete: (recipeId: string, recipeTitle: string) => void;
    canModify: (recipeAuthorId: string) => boolean;
}

const RecipeList: React.FC<RecipeListProps> = ({
    recipes,
    users,
    isLoading,
    error,
    filterTag,
    filterAuthorId,
    onTagFilterChange,
    onAuthorFilterChange,
    onDelete,
    canModify
}) => {

    return (
        <div>
            {/* Filter Controls */}
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="filterTag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Филтрирай по таг:</label>
                    <input
                        type="text"
                        id="filterTag"
                        value={filterTag}
                        onChange={onTagFilterChange}
                        placeholder="Напр.: паста, салата..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="filterAuthor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Филтрирай по автор:</label>
                    <select
                        id="filterAuthor"
                        value={filterAuthorId}
                        onChange={onAuthorFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    >
                        <option value="">-- Всички автори --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name} ({user.username})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading and Error States */}
            {isLoading && <LoadingSpinner />}
            {error && <MessageBox type="error" message={error} />}

            {/* Recipe List/Table */}
            {!isLoading && !error && (
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                    {recipes.length === 0 ? (
                         <MessageBox type="info" message="Няма намерени рецепти, отговарящи на критериите." />
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Заглавие
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                                        Автор
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                                        Тагове
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Действия
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {recipes.map((recipe) => (
                                    <tr key={recipe.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{recipe.title}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">{recipe.user?.name || 'Няма автор'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <div className="text-sm text-gray-900 dark:text-gray-200">{recipe.user?.name || 'Няма автор'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {recipe.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {recipe.tags.length > 3 && (
                                                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                                                        ...
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {/* Use canModify function from props */}
                                            {canModify(recipe.authorId) && (
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/edit-recipe/${recipe.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                                                        title="Редактирай"
                                                    >
                                                        {/* Edit Icon SVG */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => onDelete(recipe.id, recipe.title)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                                                        title="Изтрий"
                                                    >
                                                         {/* Delete Icon SVG */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecipeList;