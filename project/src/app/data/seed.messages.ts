import { Message } from "../models";

export const MESSAGES: Message[] = [
    // channel 1 — Discussions (project)
    {
        id: 'm-1',
        chatId: '1',
        senderId: '1',
        text: 'Hey everyone, welcome to the project channel. Let\'s keep updates here.',
        createdAt: '2026-08-28T09:15:00',
        isEdited: false,
    },
    {
        id: 'm-2',
        chatId: '1',
        senderId: '3',
        text: 'idk how to do the routing part yet lol',
        createdAt: '2026-08-28T10:42:00',
        isEdited: false,
    },
    {
        id: 'm-3',
        chatId: '1',
        senderId: '2',
        text: 'No worries Bob — we\'ll pair on it in the workshop.',
        createdAt: '2026-08-28T11:05:00',
        isEdited: false,
    },

    // channel 2 — Docs
    {
        id: 'm-4',
        chatId: '2',
        senderId: '2',
        text: 'Uploaded the assignment specs doc — check the README section on Phase 1.',
        createdAt: '2026-08-27T14:20:00',
        isEdited: false,
    },
    {
        id: 'm-5',
        chatId: '2',
        senderId: '1',
        text: 'Thanks Alice. I\'ll add the architecture diagram tonight.',
        createdAt: '2026-08-27T16:00:00',
        isEdited: false,
    },

    // channel 3 — Assignment-1
    {
        id: 'm-6',
        chatId: '3',
        senderId: '1',
        text: 'I just finished the dummy homepage part.',
        createdAt: '2026-08-30T08:20:00',
        isEdited: false,
    },
    {
        id: 'm-7',
        chatId: '3',
        senderId: '3',
        text: 'Nice! I\'m starting on the seed data now.',
        createdAt: '2026-08-30T09:10:00',
        isEdited: false,
    },
    {
        id: 'm-8',
        chatId: '3',
        senderId: '2',
        text: 'Remember: messages are mock only until Phase 2 socket work.',
        createdAt: '2026-08-30T09:45:00',
        isEdited: true,
    },

    // channel 4 — Events (music club)
    {
        id: 'm-9',
        chatId: '4',
        senderId: '2',
        text: 'Open mic night is next Friday at the campus bar — who\'s in?',
        createdAt: '2026-08-29T18:00:00',
        isEdited: false,
    },
    {
        id: 'm-10',
        chatId: '4',
        senderId: '4',
        text: 'I can bring my acoustic. Need a ride though.',
        createdAt: '2026-08-29T19:30:00',
        isEdited: false,
    },

    // channel 5 — Discussions (career fair)
    {
        id: 'm-11',
        chatId: '5',
        senderId: '4',
        text: 'Career meetup is Tuesday 02/08 — dress smart casual.',
        createdAt: '2026-08-25T12:00:00',
        isEdited: false,
    },
    {
        id: 'm-12',
        chatId: '5',
        senderId: '1',
        text: 'Will there be industry reps from local startups?',
        createdAt: '2026-08-25T13:15:00',
        isEdited: false,
    },
    {
        id: 'm-13',
        chatId: '5',
        senderId: '3',
        text: 'Charlie said yes — at least three companies confirmed.',
        createdAt: '2026-08-25T14:00:00',
        isEdited: false,
    },

    // channel 6 — General (cybersports)
    {
        id: 'm-14',
        chatId: '6',
        senderId: '4',
        text: 'Scrim this Saturday 6pm — Valorant then Rocket League.',
        createdAt: '2026-08-28T20:00:00',
        isEdited: false,
    },
    {
        id: 'm-15',
        chatId: '6',
        senderId: '3',
        text: 'I\'m in for RL. My rank is embarrassing though.',
        createdAt: '2026-08-28T21:10:00',
        isEdited: false,
    },

    // channel 7 — GTA VI
    {
        id: 'm-16',
        chatId: '7',
        senderId: '3',
        text: 'Anyone else hyped for the release date announcement?',
        createdAt: '2026-08-30T07:00:00',
        isEdited: false,
    },
    {
        id: 'm-17',
        chatId: '7',
        senderId: '1',
        text: 'We should do a co-op stream when it drops.',
        createdAt: '2026-08-30T07:45:00',
        isEdited: false,
    },
    {
        id: 'm-18',
        chatId: '7',
        senderId: '4',
        text: 'Only if we finish assignment 1 first 😅',
        createdAt: '2026-08-30T08:00:00',
        isEdited: false,
    },
]