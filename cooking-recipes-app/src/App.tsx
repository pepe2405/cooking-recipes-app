import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddRecipePage from './pages/AddRecipePage';
// import UsersListPage from './pages/UsersListPage';
// import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout'; 
import { AuthProvider } from './contexts/AuthContext';
import RecipesListPage from './pages/RecipesListPage';
import EditRecipePage from './pages/EditRecipePage';
import RecipeDetailPage from './pages/RecipeDetailPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="recipes" element={<RecipesListPage />} />
            <Route path="add-recipe" element={<AddRecipePage />} />
            <Route path="edit-recipe/:recipeId" element={<EditRecipePage />} />
            <Route path="recipes/:recipeId" element={<RecipeDetailPage />} />
            {/* <Route path="users" element={<UsersListPage />} /> */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
