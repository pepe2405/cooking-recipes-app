import { User, UserRole, AccountStatus } from '../models/User';

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
        const response = await fetch(`/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userToSend),
        });

        console.log(response);

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
        const response = await fetch(`/api/users?username=${encodeURIComponent(username)}`);
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
        const response = await fetch(`/api/users/${encodeURIComponent(userId)}`);

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

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch(`/api/users`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users: User[] = await response.json();
        return users.map(user => {
            const { passwordHash, ...userWithoutHash } = user;
            return userWithoutHash as User;
        });
    } catch (error) {
        console.error("Error fetching all users:", error);
        if (error instanceof Error) { throw error; }
        else { throw new Error('Възникна неочаквана грешка при извличане на потребители.'); }
    }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
    console.log(`[userService] Updating user with ID: ${userId}`, userData);

    const dataToUpdate = { ...userData };
    delete dataToUpdate.id;
    delete dataToUpdate.username;
    delete dataToUpdate.registrationDate;
    delete dataToUpdate.passwordHash;
    dataToUpdate.lastModifiedDate = new Date().toISOString();

    try {
        const response = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
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

        const updatedUser: User = await response.json();
        console.log("[userService] User updated successfully:", updatedUser);
        const { passwordHash, ...safeUserData } = updatedUser;
        return safeUserData as User;

    } catch (error) {
        console.error(`Error updating user ${userId}:`, error);
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Възникна неочаквана грешка при обновяване на потребител.');
        }
    }
};

export const deleteUser = async (userId: string): Promise<void> => {
    console.log(`[userService] Deleting user with ID: ${userId}`);
    try {
        const response = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Потребителят не е намерен или вече е изтрит.');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(`User ${userId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting user ${userId}:`, error);
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Възникна неочаквана грешка при изтриване на потребител.');
        }
    }
};
