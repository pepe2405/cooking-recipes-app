import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import RecipesListPage from './pages/RecipesListPage';
// import AddRecipePage from './pages/AddRecipePage';
// import UsersListPage from './pages/UsersListPage';
// import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          {/* <Route path="recipes" element={<RecipesListPage />} /> */}
          {/* <Route path="add-recipe" element={<AddRecipePage />} /> */}
          {/* <Route path="users" element={<UsersListPage />} /> */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App
