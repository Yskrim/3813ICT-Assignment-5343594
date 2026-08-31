import { Injectable, signal } from '@angular/core';
import { User } from '../models';
import { USERS } from '../data/seed';


const USER: User = USERS[0];

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