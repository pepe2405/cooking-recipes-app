import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { addRecipe, updateRecipe } from '../../services/recipeService';
import { Recipe } from '../../models/Recipe';
import { UserRole } from '../../models/User';
import MessageBox from '../common/MessageBox';

interface RecipeFormProps {
    initialData?: Recipe | null;
    isEditing?: boolean;
    onSubmitSuccess?: (recipe: Recipe) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ initialData, isEditing = false, onSubmitSuccess }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | ''>('');
    const [ingredients, setIngredients] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isEditing && initialData) {
            setTitle(initialData.title || '');
            setShortDescription(initialData.shortDescription || '');
            setPrepTimeMinutes(initialData.prepTimeMinutes || '');
            setIngredients(initialData.ingredients?.join(', ') || '');
            setImageUrl(initialData.imageUrl || '');
            setDescription(initialData.description || '');
            setTags(initialData.tags?.join(', ') || '');
        }
    }, [isEditing, initialData]);

    useEffect(() => {
        if (isEditing && initialData && currentUser) {
            if (currentUser.role !== UserRole.ADMIN && currentUser.id !== initialData.authorId) {
                setError("Нямате права да редактирате тази рецепта.");
                setTimeout(() => navigate('/recipes'), 3000);
            }
        } else if (isEditing && !initialData) {
             setError("Рецептата за редактиране не беше заредена.");
        }
    }, [isEditing, initialData, currentUser, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'title': setTitle(value); break;
            case 'shortDescription': setShortDescription(value); break;
            case 'prepTimeMinutes': setPrepTimeMinutes(value === '' ? '' : parseInt(value, 10)); break;
            case 'ingredients': setIngredients(value); break;
            case 'imageUrl': setImageUrl(value); break;
            case 'description': setDescription(value); break;
            case 'tags': setTags(value); break;
        }
        setError(null);
        setSuccess(null);
    };

    const parseStringToArray = (str: string): string[] => {
        if (!str) return [];
        return str.split(',')
                  .map(item => item.trim())
                  .filter(item => item !== '');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!currentUser) {
            setError("Трябва да сте влезли, за да запазите рецепта.");
            return;
        }

        const recipePayload: Partial<Recipe> = {
            title,
            shortDescription,
            prepTimeMinutes: Number(prepTimeMinutes) || 0,
            ingredients: parseStringToArray(ingredients),
            imageUrl,
            description,
            tags: parseStringToArray(tags),
        };

        if (!isEditing) {
            recipePayload.authorId = currentUser.id;
        }

        setIsLoading(true);
        try {
            let savedRecipe: Recipe;
            if (isEditing && initialData) {
                savedRecipe = await updateRecipe(initialData.id, recipePayload);
                setSuccess(`Рецепта "${savedRecipe.title}" беше успешно обновена!`);
            } else {
                savedRecipe = await addRecipe(recipePayload as Omit<Recipe, 'id' | 'creationDate' | 'lastModifiedDate'>); // Type assertion
                setSuccess(`Рецепта "${savedRecipe.title}" беше успешно създадена!`);
            }

            if (onSubmitSuccess) {
                onSubmitSuccess(savedRecipe);
            }

            setTimeout(() => {
                navigate(`/recipes`);
            }, 1500);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Възникна неочаквана грешка.');
            }
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                {isEditing ? 'Редактиране на Рецепта' : 'Добавяне на Нова Рецепта'}
            </h2>

            {error && <MessageBox type="error" message={error} />}
            {success && <MessageBox type="success" message={success} />}
            {/* Title Input */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Заглавие:</label>
                <input
                    type="text" id="title" name="title" value={title} onChange={handleChange} required maxLength={80}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Short Description Input */}
            <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Кратко описание:</label>
                <textarea
                    id="shortDescription" name="shortDescription" value={shortDescription} onChange={handleChange} maxLength={256} rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

             {/* Prep Time Input */}
             <div>
                <label htmlFor="prepTimeMinutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Време за приготвяне (минути):</label>
                <input
                    type="number" id="prepTimeMinutes" name="prepTimeMinutes" value={prepTimeMinutes} onChange={handleChange} required min="1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Ingredients Input */}
            <div>
                <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Съставки (разделени със запетая):</label>
                <textarea
                    id="ingredients" name="ingredients" value={ingredients} onChange={handleChange} required rows={4}
                    placeholder="Напр.: Домати, Краставици, Сирене"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

             {/* Image URL Input */}
             <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL на снимка:</label>
                <input
                    type="url" id="imageUrl" name="imageUrl" value={imageUrl} onChange={handleChange} required
                    placeholder="https://example.com/recipe-image.jpg"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

             {/* Description Input */}
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Подробно описание:</label>
                <textarea
                    id="description" name="description" value={description} onChange={handleChange} required maxLength={2048} rows={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Tags Input */}
            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Тагове (разделени със запетая):</label>
                <input
                    type="text" id="tags" name="tags" value={tags} onChange={handleChange} required
                    placeholder="Напр.: салата, българска, лято, бързо"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Submit Button */}
            <div>
                <button
                    type="submit"
                    disabled={isLoading || (isEditing && !initialData)}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Запазване...' : (isEditing ? 'Запази промените' : 'Добави рецепта')}
                </button>
            </div>
        </form>
    );
};

export default RecipeForm;
