export type UserRole = 'user' | 'groupAdmin' | 'superAdmin';

export interface User {
    id: string;
    username: string;
    password: string;
    role: UserRole;
    displayName: string;
    avatarUrl?: string;
    groupIds: string[];
    dateOfBirth: Date;
}
