import { Injectable, signal } from '@angular/core';
import { User } from '../models';
import { USERS } from '../data/seed';

@Injectable({ providedIn: 'root' })

export class AuthService {
    currentUser = signal<User | null>(null);

    login(username: string, password: string): boolean {
        // get the user from seed
        const user = USERS.find(u => u.username === username.trim() && u.password === password)

        //check it's been returned
        if(!user) {
            return false;
        }

        // set user to signal
        this.currentUser.set(user);
        // like is logged in session cookie
        return true;
    }

    logout(): void {
        this.currentUser.set(null);
    }
}