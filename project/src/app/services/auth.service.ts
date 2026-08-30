import { Injectable, signal } from '@angular/core';
import { User } from '../models';

const USER: User = {
    id: '1',
    username: '@korton',
    password: '123',
    role: 'superAdmin',
    displayName: 'Anton Korotkov',
    groupIds: ['1', '2'],
    dateOfBirth: new Date('2002-01-01'),
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    currentUser = signal<User | null>(USER); // Default logged in

    constructor() { }

    login(): void {
        this.currentUser.set(USER);
    }

    logout(): void {
        this.currentUser.set(null);
    }
}