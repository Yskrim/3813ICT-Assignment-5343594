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

    sendMessage(channelId: string, senderId: string, text: string): Message | undefined {
        const trimmed = text.trim();

        const message: Message = {
            id: MESSAGES.length.toString(),
            chatId: channelId,
            senderId,
            text: trimmed,
            createdAt: new Date().toISOString(),
            isEdited: false,
        }
        MESSAGES.push(message)
        return message
    }

    // delete a message from the list
    deleteMessage(channelId: string, senderId: string, messageId: string): boolean {
        const index = MESSAGES.findIndex(
            (m) => m.id === messageId && m.chatId === channelId,
        );
        if (index === -1) return false;
        if (MESSAGES[index].senderId !== senderId) return false;

        MESSAGES.splice(index, 1);
        return true;
    }
    
    // update a message on the list -- TODO
}



