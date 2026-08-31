export type AdminRequestType = 'ban' | 'deleteGroup' | 'deleteChannel' | 'deleteAccount' | 'kick' | 'report' | 'add-admin' | 'remove-admin';

export type AdminRequestStatus = 'pending' | 'resolved' | 'rejected' | 'approved';

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
    reviewedBy : string | null
    reviewedAt : Date | null 
}