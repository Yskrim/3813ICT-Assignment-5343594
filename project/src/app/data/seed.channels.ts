import { Channel } from "../models";

export const CHANNELS: Channel[] = [
    // project channels
    {
        id: '1',
        name: 'Discussions',
        groupId: '1',
        adminIds: ['1', '2'],
        memberIds: ['2', '3', '1'],
    },
    {
        id: '2',
        name: 'Docs',
        groupId: '1',
        adminIds: ['1', '2'],
        memberIds: ['2', '3', '1'],
    },
    {
        id: '3',
        name: 'Assignment-1',
        groupId: '1',
        adminIds: ['1', '2'],
        memberIds: ['2', '3', '1'],
    },

    // music club chats
    {
        id: '4',
        name: 'Events',
        groupId: '4',
        adminIds: ['2'],
        memberIds: ['3', '4', '2'],
    },

    // meetup chats
    {
        id: '5',
        name: 'Discussions',
        groupId: '2',
        adminIds: ['4'],
        memberIds: ['3', '1', '4', '2'],
    },

    // cybersport chats
    {
        id: '6',
        name: 'General',
        groupId: '3',
        adminIds: ['4'],
        memberIds: ['3', '1', '4'],
    },
    {
        id: '7',
        name: 'GTA VI',
        groupId: '3',
        adminIds: ['4'],
        memberIds: ['3', '1', '4'],
    },
]