import { Injectable } from '@angular/core';

import { ADMIN_REQUESTS } from '../data/seed.adminRequests';
import { AdminRequest, AdminRequestStatus, User } from '../models';
import { ADMIN_REQUEST_SCOPE } from '../models';
import { GROUPS } from '../data/seed.groups';
import { ChannelService } from './channel.service';


@Injectable({ providedIn: 'root' })

export class AdminRequestService {
    constructor(private channelService: ChannelService) {}

    getPanelView(user: User) {
        const managedGroupsIds = GROUPS
            .filter(g => g.adminIds.includes(user.id))
            .map(g => g.id);

        let groupRequests: AdminRequest[] = [];
        let superRequests: AdminRequest[] = [];

        if (managedGroupsIds.length > 0) {
            groupRequests = ADMIN_REQUESTS.filter(r =>
                r.status === 'pending' &&
                ADMIN_REQUEST_SCOPE[r.type] === 'group' &&
                r.targetGroupId != null &&
                managedGroupsIds.includes(r.targetGroupId),
            );
        }

        if (user.role === 'superAdmin') {
            superRequests = ADMIN_REQUESTS.filter(r =>
                r.status === 'pending' &&
                ADMIN_REQUEST_SCOPE[r.type] === 'super',
            );
        }

        return { groupRequests, superRequests };
    }


    getPending(requests: AdminRequest[]): AdminRequest[] {
        return requests.filter(r => r.status === 'pending')
    }

    approve(adminId: string, id: string): AdminRequest | undefined {
        return this.updateReqStatus(adminId, id, 'approved');
    }
    reject(adminId: string, id: string): AdminRequest | undefined {
        return this.updateReqStatus(adminId, id, 'rejected');
    }
    
    updateReqStatus(
        adminId: string,
        id: string,
        status: AdminRequestStatus,
    ): AdminRequest | undefined {
        const index = ADMIN_REQUESTS.findIndex(r => r.id === id);
        if (index === -1) return undefined;

        const request = ADMIN_REQUESTS[index];
        if (request.status !== 'pending') return undefined;

        if (status === 'approved' && request.type === 'createChannel') {
            this.channelService.createFromRequest(request);
        }

        ADMIN_REQUESTS[index] = {
            ...request,
            status,
            reviewedBy: adminId,
            reviewedAt: new Date(),
        };

        return ADMIN_REQUESTS[index];
    }
}


