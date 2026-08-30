export type AdminRequestType = 'ban' | 'deleteGroup' | 'deleteChannel' | 'deleteAccount' | 'kick' | 'report';
export type AdminRequestStatus = 'pending' | 'resolved' | 'declined';

export interface AdminRequest {
    id: string
    type: AdminRequestType // все виды реквеста
    issuerId: string // отправитель
    targetUserId?: string // целевой юзер
    targetGroupId?: string // целевая группа
    targetChannelId?: string // целевой канал
    reason: string
    status: AdminRequestStatus
    createdAt: Date
}