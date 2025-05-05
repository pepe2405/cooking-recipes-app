import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, RecipeWithAuthor } from '../services/recipeService';
import RecipeForm from '../components/recipe/RecipeForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MessageBox from '../components/common/MessageBox';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../models/User';

const EditRecipePage: React.FC = () => {
    const { recipeId } = useParams<{ recipeId: string }>();
    const { currentUser, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [recipeData, setRecipeData] = useState<RecipeWithAuthor | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!recipeId) {
            setError("Липсва ID на рецепта.");
            setIsLoading(false);
            return;
        }

        if (authLoading) {
            return;
        }

        console.log(`[EditRecipePage] Fetching recipe with ID: ${recipeId}`);
        getRecipeById(recipeId)
            .then(data => {
                if (data) {
                    if (!currentUser || (currentUser.role !== UserRole.ADMIN && currentUser.id !== data.authorId)) {
                        setError("Нямате права да редактирате тази рецепта.");
                        setTimeout(() => navigate('/recipes'), 3000);
                    } else {
                        setRecipeData(data);
                    }
                } else {
                    setError("Рецептата не е намерена.");
                }
            })
            .catch(err => {
                console.error("Error fetching recipe for edit:", err);
                setError(err instanceof Error ? err.message : 'Грешка при зареждане на рецептата.');
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [recipeId, currentUser, authLoading, navigate]);

    if (isLoading || authLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <MessageBox type="error" message={error} />;
    }

    if (!recipeData) {
        return <MessageBox type="warning" message="Не може да се зареди рецептата за редактиране." />;
    }

    return (
        <div>
            <RecipeForm initialData={recipeData} isEditing={true} />
        </div>
    );
};

export default EditRecipePage;
