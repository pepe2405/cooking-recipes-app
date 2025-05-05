import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { getAllUsers, getUserById } from './userService';

export interface RecipeWithAuthor extends Recipe {
    user?: User;
}

export const addRecipe = async (recipeData: Omit<Recipe, 'id' | 'creationDate' | 'lastModifiedDate'>): Promise<Recipe> => {
    if (!recipeData.title || recipeData.title.length > 80) {
        throw new Error('Заглавието е задължително (до 80 символа).');
    }
    if (!recipeData.imageUrl || !isValidHttpUrl(recipeData.imageUrl)) {
         throw new Error('URL адресът на снимката е задължителен и трябва да е валиден.');
    }
    if (!recipeData.description || recipeData.description.length > 2048) {
        throw new Error('Подробното описание е задължително (до 2048 символа).');
    }
    if (recipeData.prepTimeMinutes <= 0) {
        throw new Error('Времето за приготвяне трябва да е положително число.');
    }
    if (!recipeData.ingredients || recipeData.ingredients.length === 0) {
        throw new Error('Трябва да има поне една съставка.');
    }
     if (!recipeData.tags || recipeData.tags.length === 0) {
        throw new Error('Трябва да има поне един таг.');
    }


    const newRecipe: Omit<Recipe, 'id'> = {
        ...recipeData,
        creationDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString(),
    };

    try {
        const response = await fetch(`/api/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRecipe),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const createdRecipe: Recipe = await response.json();
        return createdRecipe;
    } catch (error) {
        console.error("Error adding recipe:", error);
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Възникна неочаквана грешка при добавяне на рецепта.');
        }
    }
};

export interface GetRecipesParams {
    limit?: number;
    sort?: keyof Recipe;
    order?: 'asc' | 'desc';
    tagsLike?: string;
    authorId?: string;
    q?: string;
}

export const getRecipes = async (params: GetRecipesParams = {}): Promise<RecipeWithAuthor[]> => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('_limit', params.limit.toString());
    if (params.sort) queryParams.append('_sort', params.sort);
    if (params.order) queryParams.append('_order', params.order);
    if (params.tagsLike) queryParams.append('q', params.tagsLike);
    if (params.authorId) queryParams.append('authorId', params.authorId);
    if (params.q && !params.tagsLike) queryParams.append('q', params.q);

    const queryString = queryParams.toString();
    const recipesUrl = `/api/recipes${queryString ? `?${queryString}` : ''}`;

    try {
        const [recipesResponse, usersResponse] = await Promise.all([
            fetch(recipesUrl),
            getAllUsers() 
        ]);

        if (!recipesResponse.ok) {
            throw new Error(`HTTP error fetching recipes! status: ${recipesResponse.status}`);
        }

        const recipes: Recipe[] = await recipesResponse.json();
        const users: User[] = usersResponse;

        const userMap = new Map(users.map(user => [user.id, user]));

        const recipesWithAuthors: RecipeWithAuthor[] = recipes.map(recipe => {
            const author = userMap.get(recipe.authorId);
            return {
                ...recipe,
                user: author
            };
        });

        return recipesWithAuthors;

    } catch (error) {
        console.error("Error in getRecipes (combined fetch):", error);
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Възникна неочаквана грешка при извличане на рецепти и автори.');
        }
    }
};

export const deleteRecipe = async (recipeId: string): Promise<void> => {
    try {
        const response = await fetch(`/api/recipes/${encodeURIComponent(recipeId)}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Рецептата не е намерена или вече е изтрита.');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error(`Error deleting recipe ${recipeId}:`, error);
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Възникна неочаквана грешка при изтриване на рецепта.');
        }
    }
};

export const getRecipeById = async (recipeId: string): Promise<RecipeWithAuthor | null> => {
    console.log(`[recipeService] getRecipeById called for ID: ${recipeId}`);
    try {
        const recipeResponse = await fetch(`/api/recipes/${encodeURIComponent(recipeId)}`);

        if (recipeResponse.status === 404) {
            console.log(`[recipeService] Recipe with ID ${recipeId} not found (404).`);
            return null;
        }
        if (!recipeResponse.ok) {
            throw new Error(`HTTP error fetching recipe! status: ${recipeResponse.status}`);
        }
        const recipe: Recipe = await recipeResponse.json();

        let author: User | null = null;
        if (recipe.authorId) {
            try {
                author = await getUserById(recipe.authorId);
            } catch (userError) {
                console.error(`[recipeService] Error fetching author ${recipe.authorId} for recipe ${recipeId}:`, userError);
            }
        }

        const recipeWithAuthorData: RecipeWithAuthor = {
            ...recipe,
            user: author || undefined,
        };
        return recipeWithAuthorData;

    } catch (error) {
        console.error(`Error in getRecipeById for ID ${recipeId}:`, error);
        throw error;
    }
};

export const updateRecipe = async (recipeId: string, recipeData: Partial<Recipe>): Promise<Recipe> => {
    console.log(`[recipeService] Updating recipe with ID: ${recipeId}`, recipeData);

    const dataToUpdate = { ...recipeData };
    delete dataToUpdate.id; 
    delete dataToUpdate.creationDate;
    dataToUpdate.lastModifiedDate = new Date().toISOString();

    if (dataToUpdate.title !== undefined && (dataToUpdate.title === '' || dataToUpdate.title.length > 80)) {
        throw new Error('Заглавието не може да бъде празно и трябва да е до 80 символа.');
    }
     if (dataToUpdate.imageUrl !== undefined && (!dataToUpdate.imageUrl || !isValidHttpUrl(dataToUpdate.imageUrl))) {
         throw new Error('URL адресът на снимката е задължителен и трябва да е валиден.');
    }

    try {
        const response = await fetch(`/api/recipes/${encodeURIComponent(recipeId)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToUpdate),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const updatedRecipe: Recipe = await response.json();
        return updatedRecipe;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Възникна неочаквана грешка при обновяване на рецептата.');
        }
    }
};


function isValidHttpUrl(string: string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}