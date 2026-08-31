import { Injectable } from '@angular/core';

import { ADMIN_REQUESTS } from '../data/seed.adminRequests';
import { AdminRequest, AdminRequestStatus, User } from '../models';
import { ADMIN_REQUEST_SCOPE } from '../models';
import { GROUPS } from '../data/seed.groups';


@Injectable({ providedIn: 'root' })

export class AdminRequestService {
    getPanelView(user: User) {
        // get managed groups if groupAdmin + super is default admin
        const managedGroupsIds = GROUPS.filter(g => g.adminIds.includes(user.id)).map(g => g.id);

        let groupRequests: AdminRequest[] = [];
        let superRequests: AdminRequest[] = [];

        if (user.role === 'groupAdmin') {
            groupRequests = ADMIN_REQUESTS.filter(r =>
                ADMIN_REQUEST_SCOPE[r.type] === 'group' &&
                r.targetGroupId != null &&
                managedGroupsIds.includes(r.targetGroupId),
            )
        }

        // get super requests if super
        if (user.role === 'superAdmin') {
            superRequests = ADMIN_REQUESTS.filter(r => ADMIN_REQUEST_SCOPE[r.type] === 'super');
        }

        return { groupRequests, superRequests }
    }


    getPending(requests: AdminRequest[]): AdminRequest[] {
        return requests.filter(r => r.status === 'pending')
    }
    
    updateReqStatus(
        adminId: string,
        id: string,
        status: AdminRequestStatus,
    ): AdminRequest | undefined {
    
        const index = ADMIN_REQUESTS.findIndex(r => r.id === id);
    
    
        ADMIN_REQUESTS[index] = {
            ...ADMIN_REQUESTS[index],
            status,
            reviewedBy: adminId,
            reviewedAt: new Date()
        };
    
        return ADMIN_REQUESTS[index];
    }
}


