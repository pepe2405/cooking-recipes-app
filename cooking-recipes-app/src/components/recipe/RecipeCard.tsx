import React from 'react';
import { Link } from 'react-router-dom';
import { RecipeWithAuthor } from '../../services/recipeService';

interface RecipeCardProps {
    recipe: RecipeWithAuthor;
}

const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const author = recipe.user ? `${recipe.user.name}` : null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
            {/* Recipe Image */}
            <Link to={`/recipes/${recipe.id}`} className="block"> {/* Link to recipe details page (TODO: create page) */}
                <img
                    src={recipe.imageUrl}
                    alt={`[Снимка на ${recipe.title}]`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Recipe+Image';
                    }}
                />
            </Link>

            {/* Recipe Content */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                     <Link to={`/recipes/${recipe.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                        {recipe.title}
                     </Link>
                </h3>

                {/* Short Description (Truncated) */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex-grow">
                    {truncateText(recipe.shortDescription || recipe.description, 100)}
                </p>

                {/* Tags */}
                 <div className="mb-3 flex flex-wrap gap-2">
                    {recipe.tags.slice(0, 5).map((tag) => (
                        <span key={tag} className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded">
                            #{tag}
                        </span>
                    ))}
                </div>


                {/* Author Info & Prep Time */}
                <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                     {/* Author */}
                     <div className="flex items-center">
                        {author ? (
                            <>
                                <span>{author}</span>
                            </>
                        ) : (
                            <span>Автор неизвестен</span>
                        )}
                    </div>
                    {/* Prep Time */}
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {recipe.prepTimeMinutes} мин.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;