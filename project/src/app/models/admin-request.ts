export type AdminRequestType = 'banUser' | 'deleteGroup' | 'createGroup' | 'deleteChannel' | 'deleteAccount' | 'kickUser' | 'giveAdmin' | 'revokeAdmin' | 'createChannel';
export type AdminRequestScope = 'super' | 'group'
export type AdminRequestStatus = 'pending' | 'resolved' | 'rejected' | 'approved';

export const ADMIN_REQUEST_SCOPE: Record<AdminRequestType, AdminRequestScope> = {
    // super scope
    banUser: 'super',
    deleteGroup: 'super',
    createGroup: 'super',
    deleteAccount: 'super',
    giveAdmin: 'super',
    revokeAdmin: 'super',

    // group scope
    kickUser: 'group',
    deleteChannel: 'group',
    createChannel: 'group',
}


export interface AdminRequest {
    id: string
    type: AdminRequestType // все виды реквеста
    issuerId: string // отправитель
    targetUserId?: string // целевой юзер
    targetGroupId?: string // целевая группа
    targetChannelId?: string // целевой канал
    note: string
    status: AdminRequestStatus
    createdAt: Date
    reviewedBy: string | null
    reviewedAt: Date | null
}