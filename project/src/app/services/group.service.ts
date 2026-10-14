import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Group } from '../models';

@Injectable({ providedIn: 'root' })
export class GroupService {
	private http = inject(HttpClient);
	private readonly url = '/api/groups';

	// cache of the last server answer for the current user
	readonly myGroups = signal<Group[]>([]);

	// all groups in the system (superAdmin)
	getAll(): Observable<Group[]> {
		return this.http.get<Group[]>(this.url);
	}

	// groups where the user is a member or an admin
	getForUser(userId: string): Observable<Group[]> {
		return this.http
			.get<Group[]>(this.url, { params: { userId } })
			.pipe(tap((groups) => this.myGroups.set(groups)));
	}

	getById(id: string): Observable<Group> {
		return this.http.get<Group>(`${this.url}/${id}`);
	}

	create(name: string): Observable<Group> {
		return this.http
			.post<Group>(this.url, { name })
			.pipe(tap((newGroup) => this.myGroups.update((prev) => [...prev, newGroup])));
	}

	// on logout the next user doesnt see these groups
	clear(): void {
		this.myGroups.set([]);
	}
}
