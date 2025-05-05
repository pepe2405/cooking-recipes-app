import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetRecipesParams, RecipeWithAuthor } from '../services/recipeService';
import { getRecipes } from '../services/recipeService';
import RecipeCard from '../components/recipe/RecipeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MessageBox from '../components/common/MessageBox';

const HomePage: React.FC = () => {
  const [latestRecipes, setLatestRecipes] = useState<RecipeWithAuthor[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch latest recipes on component mount
    useEffect(() => {
        const fetchLatestRecipes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const params: GetRecipesParams = {
                    limit: 10,
                    sort: 'creationDate',
                    order: 'desc',
                };
                const fetchedRecipesWithAuthor: RecipeWithAuthor[] = await getRecipes(params);
                setLatestRecipes(fetchedRecipesWithAuthor);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Неуспешно зареждане на последните рецепти.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestRecipes();
    }, []);

  return (
    <div className="text-center py-10 px-4">

      {/* Основно заглавие */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
        🍳 Добре дошли в Cooking Recipes!
      </h1>

      {/* Подзаглавие/Описание */}
      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Вашето място за откриване, споделяне и наслаждаване на невероятни готварски рецепти от цял свят.
      </p>

      {/* Бутони/Линкове за действие */}
      <div className="space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Линка към страницата с всички рецепти */}
        <Link
          to="/recipes"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          Разгледай Рецепти
        </Link>

      </div>

      <div className="mt-16 pt-10 border-t border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
            Последни Публикации
        </h2>

        {/* Conditional Rendering based on loading/error state */}
        {isLoading && <LoadingSpinner />} {/* Show spinner while loading */}

        {error && <MessageBox type="error" message={error} />} {/* Show error message */}

        {!isLoading && !error && latestRecipes.length === 0 && (
              <MessageBox type="info" message="Все още няма публикувани рецепти." />
        )}

        {!isLoading && !error && latestRecipes.length > 0 && (
            // Grid layout for recipe cards
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
                {latestRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        )}
      </div>

    </div>
  );
};

export default HomePage;
