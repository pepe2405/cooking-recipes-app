export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export enum AccountStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    DEACTIVATED = 'deactivated',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export interface User {
    id: string;
    name: string;
    username: string;
    passwordHash?: string;
    gender: Gender;
    role: UserRole;
    pictureUrl?: string;
    bio?: string;
    status: AccountStatus;
    registrationDate: string;
    lastModifiedDate: string;
}