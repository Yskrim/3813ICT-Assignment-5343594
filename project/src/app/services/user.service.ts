import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { UtilsService } from './utils.service';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
    private util = inject(UtilsService);
	private http = inject(HttpClient);
	private readonly url = '/api/users';

	getById(id: string): Observable<User> {
		return this.http.get<User>(`${this.url}/${id}`);
	}

	// TEMPORARY downloads all users and filters here -- TODO ----------------------------------
	getByIds(ids: string[]): Observable<User[]> {
		if (!ids.length) return of([]);
		return this.http.get<User[]>(this.url).pipe(map((users) => users.filter((u) => ids.includes(u.id))));
	}

	// only the changed fields
	update(id: string, changes: Partial<User>): Observable<User> {
		return this.http.patch<User>(`${this.url}/${id}`, changes);
	}

	// SUCCESS - no content, FAILURE - error
	delete(id: string): Observable<void> {
		return this.http.delete<void>(`${this.url}/${id}`);
	}

    calculateAge(dob: Date | string): string {
        const userDob = dob instanceof Date ? dob : new Date(dob);
        const today = new Date();
        return (today.getFullYear() - userDob.getFullYear()).toString();
    }
}
