import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map } from 'rxjs';
import { Group } from '../models';
import { apiURL } from '../app.config';

@Injectable({ providedIn: 'root' })
export class GroupService {

    constructor(
        private http: HttpClient
    ) { }

    getByGroupId(userId: string, groupId: string): Observable<Group | undefined> {
        // prepate http request
        // return Observable, response will be parsed on the component
        return this.http.get<Group>(`${apiURL}/groups/${groupId}`);
    }

    // fetch groups for userId
    getGroupsForUser(userId: string): Observable<Group[]> {
        return this.http.get<Group[]>(`${apiURL}/groups`).pipe(
            map(groups =>
                groups.filter(g =>
                    {   
                        const match = g.memberIds.includes(userId) || g.adminIds.includes(userId)
                        console.log(g, match)
                        return match
                    }
                )
            )
        );
    }

    getAllGroups(): Observable<Group[]> {
        return this.http.get<Group[]>(`${apiURL}/groups`);
    }
}
