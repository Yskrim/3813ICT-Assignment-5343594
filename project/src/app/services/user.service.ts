import { User } from '../models';
import { USERS } from '../data/seed';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class UserService {
    // find a userx
    getByUserId(id: string): User | undefined {
        return USERS.find(u => u.id === id);
    }

    // find list of users
    getMembers(ids: string): User[] {
        return USERS.filter(u => ids.includes(u.id));
    }

    updateUser(id: string, changes: Partial<User>): User | undefined {
        const index = USERS.findIndex(u => u.id === id);
        if (index === -1) return undefined;
        USERS[index] = { ...USERS[index], ...changes };
        return USERS[index];
    }

    deleteUser(id: string): boolean {
        const index = USERS.findIndex(u => u.id === id);
        if (index === -1) return false;
        USERS.splice(index, 1);
        return true;
    }
}



