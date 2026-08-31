import { Channel } from "../models";

export const CHANNELS: Channel[] = [
    // project channels
    {
        id: 'c-1',
        name: 'Discussions',
        groupId: '1',
        adminIds: ['1', '2'],
        memberIds: ['2', '3', '1'],
    },
    {
        id: 'c-2',
        name: 'Docs',
        groupId: '1',
        adminIds: ['1', '2'],
        memberIds: ['2', '3', '1'],
    },
    {
        id: 'c-3',
        name: 'Assignment-1',
        groupId: '1',
        adminIds: ['1', '2'],
        memberIds: ['2', '3', '1'],
    },

    // music club chats
    {
        id: 'c-4',
        name: 'Events',
        groupId: '4',
        adminIds: ['2'],
        memberIds: ['3', '4', '2'],
    },

    // meetup chats
    {
        id: 'c-5',
        name: 'Discussions',
        groupId: '2',
        adminIds: ['4'],
        memberIds: ['3', '1', '4', '2'],
    },

    // cybersport chats
    {
        id: 'c-6',
        name: 'General',
        groupId: '3',
        adminIds: ['4'],
        memberIds: ['3', '1', '4'],
    },
    {
        id: 'c-7',
        name: 'GTA VI',
        groupId: '3',
        adminIds: ['4'],
        memberIds: ['3', '1', '4'],
    },
]