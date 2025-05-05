import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../services/userService';
import UserForm from '../components/user/UserForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MessageBox from '../components/common/MessageBox';
import { useAuth } from '../hooks/useAuth';
import { User, UserRole } from '../models/User';

const EditUserPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { currentUser, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setError("Липсва ID на потребител.");
            setIsLoading(false);
            navigate('/users');
            return;
        }

        if (authLoading) {
            return;
        }

        if (!currentUser || currentUser.role !== UserRole.ADMIN) {
             setError("Нямате права за достъп до тази страница.");
             setIsLoading(false);
             setTimeout(() => navigate('/'), 3000);
             return;
        }

        console.log(`[EditUserPage] Fetching user with ID: ${userId}`);
        setIsLoading(true);
        getUserById(userId)
            .then(data => {
                if (data) {
                    console.log("[EditUserPage] User data fetched:", data);
                    setUserData(data);
                } else {
                    setError(`Потребител с ID "${userId}" не беше намерен.`);
                    setTimeout(() => navigate('/users'), 3000);
                }
            })
            .catch(err => {
                console.error("Error fetching user for edit:", err);
                setError(err instanceof Error ? err.message : 'Грешка при зареждане на потребителя.');
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [userId, currentUser, authLoading, navigate]);

    if (isLoading || authLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <MessageBox type="error" message={error} />;
    }

    if (!userData) {
        return <MessageBox type="warning" message="Не може да се зареди потребителят за редактиране." />;
    }

    return (
        <div>
            <UserForm
                userToEdit={userData}
                onUpdateSuccess={(updatedUser) => {
                    console.log('User updated successfully:', updatedUser);
                    // Пренасочваме към списъка с потребители след успех
                    navigate('/users', { state: { message: `Потребител ${updatedUser.username} е обновен.` } });
                }}
            />
        </div>
    );
};

export default EditUserPage;
