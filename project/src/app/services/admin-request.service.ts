import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminRequest, AdminRequestStatus, User } from '../models';
import { ADMIN_REQUEST_SCOPE } from '../models';
import { ChannelService } from './channel.service';
import { GroupService } from './group.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { apiURL } from '../app.config';

@Injectable({ providedIn: 'root' })
export class AdminRequestService {
    private readonly requestsUrl = `${apiURL}/admin-requests`;

    constructor(
        private http: HttpClient,
        private channelService: ChannelService,
        private groupService: GroupService,
    ) { }

    getAdminRequests(user: User): Observable<{ groupRequests: AdminRequest[]; superRequests: AdminRequest[] }> {
        return this.groupService.getGroupsForUser(user.id).pipe(
            switchMap((groups) =>
                this.http.get<AdminRequest[]>(this.requestsUrl).pipe(
                    map((requests) => {
                        const managedGroupsIds = groups
                            .filter((g) => g.adminIds?.includes(user.id))
                            .map((g) => g.id);

                        const groupRequests = managedGroupsIds.length
                            ? requests.filter(
                                (r) =>
                                    r.status === 'pending' &&
                                    ADMIN_REQUEST_SCOPE[r.type] === 'group' &&
                                    r.targetGroupId != null &&
                                    managedGroupsIds.includes(r.targetGroupId),
                            )
                            : [];

                        const superRequests =
                            user.role === 'superAdmin'
                                ? requests.filter(
                                    (r) =>
                                        r.status === 'pending' &&
                                        ADMIN_REQUEST_SCOPE[r.type] === 'super',
                                )
                                : [];

                        return { groupRequests, superRequests };
                    }),
                ),
            ),
        );
    }

    approve(adminId: string, id: string): Observable<AdminRequest | undefined> {
        return this.updateReqStatus(adminId, id, 'approved');
    }

    reject(adminId: string, id: string): Observable<AdminRequest | undefined> {
        return this.updateReqStatus(adminId, id, 'rejected');
    }

    updateReqStatus(
        adminId: string,
        id: string,
        status: AdminRequestStatus,
    ): Observable<AdminRequest | undefined> {
        return this.http.get<AdminRequest>(`${this.requestsUrl}/${id}`).pipe(
            switchMap((request) => {
                if (!request || request.status !== 'pending') return of(undefined);

                const updatedRequest: AdminRequest = {
                    ...request,
                    status,
                    reviewedBy: adminId,
                    reviewedAt: new Date(),
                };

                const createChannel$ =
                    status === 'approved' && request.type === 'createChannel'
                        ? this.channelService.createFromRequest(request)
                        : of(undefined);

                return createChannel$.pipe(
                    switchMap(() =>
                        this.http.put<AdminRequest>(`${this.requestsUrl}/${id}`, updatedRequest),
                    ),
                );
            }),
        );
    }
}