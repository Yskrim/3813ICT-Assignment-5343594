import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { User, UserRole } from '../models';
import { apiURL } from '../app.config';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { GroupService } from './group.service';

// save/pull user in/from localstorage
const STORAGE_KEY = 'currentUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private http = inject(HttpClient);
	private storage = inject(StorageService);
	private router = inject(Router);
	private groupService = inject(GroupService);

	private readonly userState = signal<User | null>(this.storage.get<User>(STORAGE_KEY));
	readonly currentUser = computed(() => this.userState());
	readonly isLoggedIn = computed(() => this.userState() !== null);

	constructor() {
		window.addEventListener('storage', (e) => {
			if (e.key !== STORAGE_KEY && e.key !== null) return;
			this.userState.set(this.storage.get<User>(STORAGE_KEY));
		});
	}

	hasRole(...roles: UserRole[]): boolean {
		const user = this.currentUser();
		if (!user) return false;
		if (roles.includes(user.role)) return true;
		return false;
	}

	login(username: string, password: string): Observable<User | null> {
        const authRequest$ = this.http.post<User>(`${apiURL}/auth/login`, { username, password }).pipe(
			tap((user) => {
				this.userState.set(user);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
			}),
			catchError(() => of(null)),
		);

        return authRequest$;
	}

	// replace the session user after a profile update
	setUser(user: User): void {
		this.userState.set(user);
		this.storage.set(STORAGE_KEY, user);
	}

	logout(): void {
		this.userState.set(null);
		this.storage.remove(STORAGE_KEY);
		this.groupService.clear();
	}
}