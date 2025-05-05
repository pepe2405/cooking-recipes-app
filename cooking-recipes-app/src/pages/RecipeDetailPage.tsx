import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeById, RecipeWithAuthor } from '../services/recipeService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MessageBox from '../components/common/MessageBox';
import { format } from 'date-fns';

const RecipeDetailPage: React.FC = () => {
    const { recipeId } = useParams<{ recipeId: string }>();
    const [recipe, setRecipe] = useState<RecipeWithAuthor | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!recipeId) {
            setError("Липсва ID на рецепта.");
            setIsLoading(false);
            return;
        }

        const fetchRecipe = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getRecipeById(recipeId);
                if (data) {
                    setRecipe(data);
                } else {
                    setError(`Рецепта с ID "${recipeId}" не беше намерена.`);
                }
            } catch (err) {
                console.error("Error fetching recipe details:", err);
                setError(err instanceof Error ? err.message : 'Грешка при зареждане на рецептата.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <MessageBox type="error" message={error} />;
    }

    if (!recipe) {
        return <MessageBox type="info" message="Рецептата не може да бъде заредена." />;
    }

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
        } catch (e) {
            return 'Невалидна дата';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <article className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-64 object-cover object-center"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://placehold.co/800x400/cccccc/ffffff?text=Image+Not+Available'; // Резервно изображение
                    }}
                />

                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{recipe.title}</h1>

                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>Публикувано от: {recipe.user ? recipe.user.name : 'Неизвестен автор'}</span>
                        <span className="mx-2">|</span>
                        <span>На: {formatDate(recipe.creationDate)}</span>
                        {recipe.creationDate !== recipe.lastModifiedDate && (
                             <span className="ml-2 text-xs italic">(Редактирано: {formatDate(recipe.lastModifiedDate)})</span>
                        )}
                    </div>

                    {recipe.shortDescription && (
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 italic">{recipe.shortDescription}</p>
                    )}

                     <div className="mb-4 flex items-center text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Време за приготвяне: {recipe.prepTimeMinutes} минути</span>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Необходими продукти:</h2>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Начин на приготвяне:</h2>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{recipe.description}</p>
                    </div>

                    {recipe.tags && recipe.tags.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Ключови думи:</h3>
                            <div className="flex flex-wrap gap-2">
                                {recipe.tags.map((tag) => (
                                    <span key={tag} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <Link
                            to="/recipes"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Назад към списъка
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default RecipeDetailPage;

