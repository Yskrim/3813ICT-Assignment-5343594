import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminRequest, AdminRequestStatus, User } from '../models';
import { ADMIN_REQUEST_SCOPE } from '../models';
import { ChannelService } from './channel.service';
import { GroupService } from './group.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AdminRequestService {
	private readonly requestsUrl = `/api/admin-requests`;

	constructor(
		private http: HttpClient,
		private channelService: ChannelService,
		private groupService: GroupService,
		private userService: UserService,
	) {}

	getAdminRequests(user: User): Observable<{ groupRequests: AdminRequest[]; superRequests: AdminRequest[] }> {
		return this.groupService.getForUser(user.id).pipe(
			switchMap((groups) =>
				this.http.get<AdminRequest[]>(this.requestsUrl).pipe(
					map((requests) => {
						const managedGroupsIds = groups.filter((g) => g.adminIds?.includes(user.id)).map((g) => g.id);

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
								? requests.filter((r) => r.status === 'pending' && ADMIN_REQUEST_SCOPE[r.type] === 'super')
								: [];

						return { groupRequests, superRequests };
					}),
				),
			),
		);
	}

	create(draft: Partial<AdminRequest> & Pick<AdminRequest, 'type' | 'issuerId'>): Observable<AdminRequest> {
		return this.http.post<AdminRequest>(this.requestsUrl, draft);
	}

	approve(adminId: string, id: string): Observable<AdminRequest | undefined> {
		return this.updateReqStatus(adminId, id, 'approved');
	}

	reject(adminId: string, id: string): Observable<AdminRequest | undefined> {
		return this.updateReqStatus(adminId, id, 'rejected');
	}

	// what approved request does, one case per type
	private execute(request: AdminRequest): Observable<unknown> {
		switch (request.type) {
			case 'createChannel':
				return this.channelService.createFromRequest(request);
			case 'deleteAccount':
				return request.targetUserId ? this.userService.delete(request.targetUserId) : of(undefined);
			default:
				return of(undefined); // other types -- TODO
		}
	}

	updateReqStatus(adminId: string, id: string, status: AdminRequestStatus): Observable<AdminRequest | undefined> {
		return this.http.get<AdminRequest>(`${this.requestsUrl}/${id}`).pipe(
			switchMap((request) => {
				if (!request || request.status !== 'pending') return of(undefined);

				const updatedRequest: AdminRequest = {
					...request,
					status,
					reviewedBy: adminId,
					reviewedAt: new Date(),
				};

				// run action only on approve, reject just changes status
				const action$ = status === 'approved' ? this.execute(request) : of(undefined);

				return action$.pipe(switchMap(() => this.http.patch<AdminRequest>(`${this.requestsUrl}/${id}`, updatedRequest)));
			}),
		);
	}
}
