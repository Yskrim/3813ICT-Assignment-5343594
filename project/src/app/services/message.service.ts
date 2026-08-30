import { Message } from '../models';
import { MESSAGES } from '../data/seed';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class MessageService {
    // find a message in list
    getByChannelId(id: string): Message | undefined {
        return MESSAGES.find(m => m.id === id);
    }

    // find list of messages for chat
    getMessagesForChannel(channelId: string): Message[] {
        return MESSAGES.filter(m => m.chatId === channelId)
    }

    // delete a message from the list -- TODO
    // update a message on the list -- TODO
}



