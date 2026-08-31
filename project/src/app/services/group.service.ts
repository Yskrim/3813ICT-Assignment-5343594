import { Injectable } from '@angular/core';
import { Group } from '../models';
import { GROUPS } from '../data/seed';

@Injectable({ providedIn: 'root' })
export class GroupService {

    // search groups
    getByGroupId(id: string): Group | undefined {
        return GROUPS.find(g => g.id === id);
    }

    // fetch groups for userId
    getGroupsForUser(userId: string, groupIds: string[]): Group[] {

        // return array of group objects filled if is of that object is in the list of ids
        return GROUPS.filter(g => groupIds.includes(g.id));
    }
}
