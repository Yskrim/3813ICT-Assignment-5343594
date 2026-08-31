import { Group } from "../models"

export const GROUPS: Group[] = [
    {
        id: '1',
        name: '@3813ICT-group-project',
        adminIds: ['1', '2'],
        memberIds: ['2', '3', '1'],
    },
    {
        id: '2',
        name: '@ICT-career-fair',
        adminIds: ['4'],
        memberIds: ['3', '1', '4', '2'],
    },
    {
        id: '3',
        name: '@griffit-cybersports',
        adminIds: ['4'],
        memberIds: ['3', '1', '4'],
    },
    {
        id: '4',
        name: '@Griffith-music-club',
        adminIds: ['2'],
        memberIds: ['3', '4', '2'],
    },
]