import { User, Gender, UserRole, AccountStatus } from '../models/User';
import { API_BASE_URL } from './apiConstants';

export const registerUser = async (userData: Omit<User, 'id' | 'registrationDate' | 'lastModifiedDate' | 'status' | 'role'> & { password: string }): Promise<User> => {
    if (!userData.username || userData.username.length > 15 || !/^\w+$/.test(userData.username)) {
        throw new Error('Невалидно потребителско име (до 15 символа, само букви, цифри и долна черта).');
    }
    if (!userData.password || userData.password.length < 8 || !/\d/.test(userData.password) || !/\W/.test(userData.password)) {
        throw new Error('Паролата трябва да е поне 8 символа, с поне една цифра и един специален знак.');
    }
     if (!userData.name) {
        throw new Error('Името е задължително.');
    }

    const newUser: Omit<User, 'id'> = {
        ...userData,
        passwordHash: `hashed_${userData.password}`,
        role: UserRole.USER,
        status: AccountStatus.ACTIVE,
        registrationDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString(),
        pictureUrl: userData.pictureUrl || '',
        bio: userData.bio || '',
    };

    const userToSend = { ...newUser };

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userToSend),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const createdUser: User = await response.json();
        return createdUser;
    } catch (error) {
        console.error("Error registering user:", error);
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Възникна неочаквана грешка при регистрация.');
        }
    }
};

export const loginUser = async (username: string, password: string): Promise<User> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users?username=${encodeURIComponent(username)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users: User[] = await response.json();

        if (users.length === 0) {
            throw new Error('Грешно потребителско име или парола.');
        }

        const user = users[0];

        if (user.status !== AccountStatus.ACTIVE) {
             throw new Error(`Акаунтът е ${user.status}. Моля, свържете се с администратор.`);
        }

        const expectedPasswordHash = `hashed_${password}`;
        if (user.passwordHash !== expectedPasswordHash) {
            throw new Error('Грешно потребителско име или парола.');
        }

        return user;

    } catch (error) {
        console.error("Error logging in user:", error);
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Възникна неочаквана грешка при вход.');
        }
    }
};

export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(userId)}`);

        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const user: User = await response.json();
        return user;
    } catch (error) {
        console.error(`Error fetching user by ID ${userId}:`, error);
        throw error;
    }
};