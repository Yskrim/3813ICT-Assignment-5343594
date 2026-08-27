# Project data models

```ts
User {
  id: string
  username: string
  email?: string
  password: string // Phase 1: plain/mock; позже hash на сервере
  role: 'user' | 'groupAdmin' | 'superAdmin'
  displayName: string
  avatarUrl?: string
  groupIds: string[]  // в каких группах состоит, связывает участника и группу
  // isOnline: boolean
}

Group {
  id: string
  name: string
  adminIds: string[]  // group admins
  memberIds: string[]  // участники группы или канала
}

Channel {
  id: string
  name: string
  adminIds: string[]  // channel admins
  groupId: string
  memberIds: string[]  // участники группы или канала
}

Message {
  id: string
  chatId: string
  senderId: string
  text: string
  imageUrl?: string
  createdAt: Date | string
  isEdited: boolean
  // isRead / isDelivered — Phase 2
}

Chat {
  id: string
  participantIds: [string, string]  // ровно двое
}

AdminRequest {
  id: string
  type: 'ban' | 'deleteGroup' | 'deleteChannel' | 'deleteAccount' | 'kick' | 'report' // все виды реквеста
  issuerId: string // отправитель
  targetUserId?: string // целевой юзер
  targetGroupId?: string // целевая группа
  targetChannelId?: string // целевой канал
  message: string
  status: 'pending' | 'resolved' | 'declined'
  createdAt: Date | string
}
```
