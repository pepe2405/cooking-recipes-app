import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole, Gender } from '../../models/User';

const Header: React.FC = () => {
  const { currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getAvatarUrl = () => {
    if (currentUser?.pictureUrl) {
      return currentUser.pictureUrl;
    }
    if (currentUser?.gender === Gender.FEMALE) {
      return '/default-avatar-female.png';
    }
    return '/default-avatar-male.png';
  };

  if (isLoading) {
    return (
      <header className="bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-gray-200">
            🍳 Cooking Recipes
          </Link>
          <div className="animate-pulse h-6 w-24 bg-white/30 rounded"></div> {/* Placeholder */}
        </nav>
      </header>
    );
  }

  console.log('Current User:', currentUser); // Debugging line
  console.log('User Role:', currentUser?.role); // Debugging line

  return (
    <header className="bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-gray-200">
          🍳 Cooking Recipes
        </Link>

        <ul className="flex space-x-2 sm:space-x-4 items-center">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `hover:text-yellow-300 px-2 py-1 rounded transition duration-150 ${isActive ? 'font-bold bg-black/20' : ''}`}
            >
              Начало
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/recipes"
              className={({ isActive }) => `hover:text-yellow-300 px-2 py-1 rounded transition duration-150 ${isActive ? 'font-bold bg-black/20' : ''}`}
            >
              Рецепти
            </NavLink>
          </li>

          {currentUser ? (
            <>
              <li>
                <NavLink
                  to="/add-recipe"
                  className={({ isActive }) => `hover:text-yellow-300 px-2 py-1 rounded transition duration-150 ${isActive ? 'font-bold bg-black/20' : ''}`}
                >
                  Добави Рецепта
                </NavLink>
              </li>
              {currentUser.role === UserRole.ADMIN && (
                <li>
                  <NavLink
                    to="/users"
                    className={({ isActive }) => `hover:text-yellow-300 px-2 py-1 rounded transition duration-150 ${isActive ? 'font-bold bg-black/20' : ''}`}
                  >
                    Потребители
                  </NavLink>
                </li>
              )}
              <li className="flex items-center space-x-2 ml-2">
                <img
                  src={getAvatarUrl()}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/default-avatar-male.png';
                  }}
                />
                <span className="font-semibold hidden sm:inline">Здравей, {currentUser.name}!</span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 sm:py-2 sm:px-4 rounded transition duration-300 text-sm sm:text-base"
                >
                  Изход
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-1 px-3 sm:py-2 sm:px-4 rounded transition duration-300 text-sm sm:text-base ${isActive ? 'ring-2 ring-white' : ''}`}
                >
                  Вход
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) => `bg-white hover:bg-gray-200 text-green-600 font-bold py-1 px-3 sm:py-2 sm:px-4 rounded transition duration-300 text-sm sm:text-base ${isActive ? 'ring-2 ring-green-500' : ''}`}
                >
                  Регистрация
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
