import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getRecipes, deleteRecipe, RecipeWithAuthor } from '../services/recipeService';
import { getAllUsers } from '../services/userService';
import { User, UserRole } from '../models/User';
import { useAuth } from '../hooks/useAuth';
import RecipeList from '../components/recipe/RecipeList';
import { GetRecipesParams } from '../services/recipeService';

const RecipesListPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [recipes, setRecipes] = useState<RecipeWithAuthor[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filterTag, setFilterTag] = useState<string>('');
    const [filterAuthorId, setFilterAuthorId] = useState<string>('');

    const fetchRecipesAndUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: GetRecipesParams = {
                sort: 'creationDate',
                order: 'desc'
            };
            if (filterTag) params.tagsLike = filterTag;
            if (filterAuthorId) params.authorId = filterAuthorId;

            const [fetchedRecipes, fetchedUsers] = await Promise.all([
                getRecipes(params),
                getAllUsers()
            ]);

            setRecipes(fetchedRecipes);
            setUsers(fetchedUsers);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError(err instanceof Error ? err.message : 'Неуспешно зареждане на данните.');
        } finally {
            setIsLoading(false);
        }

    }, [filterTag, filterAuthorId]);

    useEffect(() => {
        fetchRecipesAndUsers();
    }, [fetchRecipesAndUsers]);

    const handleDelete = async (recipeId: string, recipeTitle: string) => {
        if (!window.confirm(`Сигурни ли сте, че искате да изтриете рецептата "${recipeTitle}"?`)) {
            return;
        }
        setIsLoading(true);
        try {
            await deleteRecipe(recipeId);
            setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при изтриване на рецептата.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTagFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterTag(e.target.value);
    };

    const handleAuthorFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterAuthorId(e.target.value);
    };

    const canModify = useCallback((recipeAuthorId: string): boolean => {
        if (!currentUser) return false;
        if (currentUser.role === UserRole.ADMIN) return true;
        return currentUser.id === recipeAuthorId;
    }, [currentUser]);

    const filteredRecipes = useMemo(() => {
        let tempRecipes = recipes; 

        if (filterTag.trim() !== '') {
            const lowerCaseFilterTag = filterTag.toLowerCase().trim();
            tempRecipes = tempRecipes.filter(recipe =>
                recipe.tags.some(tag => tag.toLowerCase().includes(lowerCaseFilterTag))
            );
        }

        return tempRecipes;
    }, [recipes, filterTag]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Всички Рецепти</h1>
            <RecipeList
                recipes={filteredRecipes}
                users={users}
                isLoading={isLoading}
                error={error}
                filterTag={filterTag}
                filterAuthorId={filterAuthorId}
                onTagFilterChange={handleTagFilterChange}
                onAuthorFilterChange={handleAuthorFilterChange}
                onDelete={handleDelete}
                canModify={canModify}
            />
        </div>
    );
};

export default RecipesListPage;