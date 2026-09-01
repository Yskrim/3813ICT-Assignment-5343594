import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { User } from '../models';
import { apiURL } from '../app.config';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })

export class UserService {
    user: User | null;

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.user = this.auth.currentUser()
    }

    // Get user by id (returns Observable, typically preferred for HTTP operations)
    getByUserId(userId: string): Observable<User | undefined> {
        const url = `${apiURL}/users/${userId}`;
        return this.http.get<User>(url).pipe(
            map(user => user),
            catchError(() => of(undefined)),
        );
    }

    
    getByIdsList(ids: string[]): Observable<User[]> {
        if (!ids.length) return of([]);
        return this.http.get<User[]>(`${apiURL}/users`).pipe(
            map(users => users.filter(u => ids.includes(u.id))),
            catchError(() => of([])),
        );
    }

    // Update user fields
    updateUser(id: string, changes: Partial<User>): Observable<User | undefined> {
        return this.http.put<User>(`${apiURL}/users/${id}`, changes).pipe(
            map(user => user),
            catchError(() => of(undefined)),
        );
    }

    // Delete a user by id
    deleteUser(id: string): Observable<boolean> {
        return this.http.delete(`${apiURL}/users/${id}`).pipe(
            map(() => true),
            catchError(() => of(false)),
        );
    }

    // Calculate user's age
    calculateAge(dob: Date | string): string {
        const userDob = dob instanceof Date ? dob : new Date(dob);
        const today = new Date();
        return (today.getFullYear() - userDob.getFullYear()).toString();
    }
}
