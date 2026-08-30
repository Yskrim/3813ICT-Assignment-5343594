import { Injectable } from '@angular/core';
import { CHANNELS, USERS } from '../data/seed';
import { Channel } from '../models';

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
}
