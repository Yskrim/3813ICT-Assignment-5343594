export type UserRole = 'user' | 'groupAdmin' | 'superAdmin';

export interface User {
    id: string;
    username: string;
    password?: string; // if any
    role: UserRole;
    displayName: string;
    avatarUrl?: string;
    groupIds: string[];
    dateOfBirth: Date | string; // json option
}
