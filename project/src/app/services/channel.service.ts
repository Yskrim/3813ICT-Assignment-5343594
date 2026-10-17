import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { AdminRequest, Channel } from '../models';

@Injectable({ providedIn: 'root' })
export class ChannelService {
	private http = inject(HttpClient);
	private readonly url = '/api/channels';

    readonly groupChannelsState = signal<Channel[]>([]);
    readonly currentChannelState = signal<Channel | null>(null);

	getById(id: string): Observable<Channel> {
        const getCurrentChannel$ = this.http
            .get<Channel>(`${this.url}/${id}`)
            .pipe(
                tap((data)=> this.currentChannelState.set(data as Channel))
            );
		return getCurrentChannel$;
	}

	// channels of a group visible to the user
	// userId goes away once the server knows who is asking
	getForGroup(groupId: string, userId: string): Observable<Channel[]> {
        const groupChannels$ = this.http
            .get<Channel[]>(this.url, { params: { groupId, userId } })
            .pipe(
                tap((data)=> this.groupChannelsState.set(data as Channel[]))
            );
		
        return groupChannels$;
	}

	// admins/members default to the group's on the server
	create(name: string, groupId: string): Observable<Channel> {
		return this.http.post<Channel>(this.url, { name, groupId });
	}

	// TEMPORARY: remove together with the client-side request execution 
	createFromRequest(request: AdminRequest): Observable<Channel | undefined> {
		if (!request.targetGroupId) return of(undefined);
		return this.create(request.proposedChannelName ?? 'New Channel', request.targetGroupId);
	}
}
