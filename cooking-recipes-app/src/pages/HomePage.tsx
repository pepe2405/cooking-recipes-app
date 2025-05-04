import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
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
        <p className="text-gray-500 dark:text-gray-400">
          Скоро тук ще видите най-новите добавени рецепти...
        </p>
      </div>

    </div>
  );
};

export default HomePage;
