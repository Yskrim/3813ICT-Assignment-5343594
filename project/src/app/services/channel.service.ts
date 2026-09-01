import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AdminRequest, Channel, User } from '../models';
import { GroupService } from './group.service';
import { apiURL } from '../app.config';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })

export class ChannelService {

    user: User | null;

    constructor(
        private http: HttpClient,
        private groupService: GroupService,
        private auth: AuthService,
    ) {
        this.user = this.auth.currentUser();
    }

    // search for channel
    getByChannelId(channelId: string): Observable<Channel> {
        // prepate http request
        const url = `${apiURL}/channels/${channelId}`; // TO BE UPDATED

        // return Observable, response will be parsed on the component
        return this.http.get<Channel>(url);
    }

    // channels for groupz
    getByGroupId(userId: string, groupId: string): Observable<Channel[]> {
        // prepate http request

        // return Observable, responded list of channels will be parsed on the component
        return this.http.get<Channel[]>(`${apiURL}/channels`, {
            params: { userId, groupId },
        });
    }


    // create new channel
    createFromRequest(request: AdminRequest): Observable<Channel | undefined> {

        if (!request.targetGroupId) return of(undefined); // check for target group on request
        const group = this.groupService.getByGroupId(request.issuerId, request.targetGroupId);
        if (!group) return of(undefined); // check if the target group exists


        return new Observable<Channel | undefined>((observer) => {
            this.groupService.getByGroupId(request.issuerId, String(request.targetGroupId))
                .subscribe((group) => {
                    if (!group) {
                        observer.next(undefined);
                        observer.complete();
                        return;
                    }

                    const payload = {
                        name: request.proposedChannelName ?? 'New Channel',
                        groupId: request.targetGroupId,
                        adminIds: [...new Set([...(group.adminIds || []), request.issuerId])],
                        memberIds: [...(group.memberIds || [])],
                    };

                    this.http.post<Channel>(`${apiURL}/channels`, payload)
                        .pipe(catchError(() => of(undefined)))
                        .subscribe((result) => {
                            observer.next(result);
                            observer.complete();
                        });
                });
        });
    };
}
