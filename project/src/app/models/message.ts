export interface Message {
    id: string
    channelId: string
    senderId: string
    text: string
    imageUrl?: string
    createdAt: Date | string
    isEdited: boolean
    // isRead / isDelivered — Phase 2
}