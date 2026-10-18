import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Group } from '../models';

@Injectable({ providedIn: 'root' })
export class GroupService {
	private http = inject(HttpClient);
	private readonly endpointUri = '/api/groups';

	// cache of the last server answer for the current user
	readonly allGroupsState = signal<Group[]>([]);
	readonly userGroupsState = signal<Group[]>([]);
	readonly searchGroupsState = signal<Group | null>(null);

	// all groups in the system (superAdmin)
	getAll(): Observable<Group[]> {
		const getAll$ = this.http
            .get<Group[]>(this.endpointUri)
            .pipe(
                tap((data)=> this.userGroupsState.set(data as Group[]))
            );
        
        return getAll$;
	}

	// groups where the user is a member or an admin
	getForUser(userId: string): Observable<Group[]> {
		const getForUser$ = this.http
			.get<Group[]>(this.endpointUri, { params: { userId } })
			.pipe(
                tap((userGroups) => this.userGroupsState.set(userGroups as Group[]))
            );
        
        return getForUser$;
	}

	getById(id: string): Observable<Group> {
        const getForSearch$ = this.http
            .get<Group>(`${this.endpointUri}/${id}`)
            .pipe(
                tap((responseGroup) => this.searchGroupsState.set(responseGroup))
            );

        return getForSearch$;
	}

    // search all groups by name, for joining
    search(q: string): Observable<Group[]> {
        return this.http.get<Group[]>(this.endpointUri, { params: { q } });
    }

    // join group as member -> server adds user to group + its channels
    join(groupId: string, userId: string): Observable<Group> {
        return this.http.post<Group>(`${this.endpointUri}/${groupId}/join`, { userId });
    }

	create(name: string): Observable<Group> {
		const create$ = this.http
			.post<Group>(this.endpointUri, { name })
			.pipe(
                tap((newGroup) => this.userGroupsState.update((prev) => [...prev, newGroup]))
            );
        return create$;
	}

	// on logout the next user doesnt see these groups
	clear(): void {
		this.allGroupsState.set([]);
		this.userGroupsState.set([]);
		this.searchGroupsState.set(null);
	}
}
