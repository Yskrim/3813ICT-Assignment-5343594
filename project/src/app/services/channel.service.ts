import { Injectable } from '@angular/core';
import { CHANNELS, GROUPS } from '../data/seed';
import { Channel, AdminRequest } from '../models';

@Injectable({ providedIn: 'root' })

export class ChannelService {

    // search channels
    getByChannelId(ChannelSearchQuery: string): Channel | undefined {
        return CHANNELS.find(c => c.id === ChannelSearchQuery);
    }

    // fetch array of channels for groupId
    getByGroupId(groupId: string): Channel[] {

        // return list of channels for a group
        return CHANNELS.filter(c => c.groupId === groupId);
    }

    createFromRequest(request: AdminRequest): Channel | undefined {
        if (!request.targetGroupId) return undefined;
        const group = GROUPS.find(g => g.id === request.targetGroupId);
        if (!group) return undefined;
        const nextNum = CHANNELS.reduce((max, c) => {
            const num = Number(c.id);
            return Number.isNaN(num) ? max : Math.max(max, num);
        }, 0) + 1;
        const channel: Channel = {
            id: String(nextNum),
            name: request.proposedChannelName ?? 'New Channel',
            groupId: request.targetGroupId,
            adminIds: [...new Set([...group.adminIds, request.issuerId])],
            memberIds: [...group.memberIds],
        };
        CHANNELS.push(channel);
        return channel;
    }
}
