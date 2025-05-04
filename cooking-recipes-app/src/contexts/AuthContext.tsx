import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../models/User';
import { getUserById } from '../services/userService';

interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    isLoading: true,
    login: () => {},
    logout: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('loggedInUserId');
        if (storedUserId) {
            getUserById(storedUserId)
                .then(user => {
                    if (user) {
                        setCurrentUser(user);
                    } else {
                        sessionStorage.removeItem('loggedInUserId');
                    }
                })
                .catch(error => {
                    console.error("Error fetching user data from session:", error);
                    sessionStorage.removeItem('loggedInUserId');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = (userData: User) => {
        setCurrentUser(userData);
        sessionStorage.setItem('loggedInUserId', userData.id);
        setIsLoading(false);
    };

    const logout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('loggedInUserId');
        setIsLoading(false);
    };

    const value = {
        currentUser,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};