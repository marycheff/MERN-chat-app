import { IUser } from "@/types/user.types"

export interface IMessage {
    id?: string
    senderId?: string
    receiverId?: string
    text?: string
    image?: string
    createdAt?: string
    updatedAt?: string
}

export interface ChatState {
    messages: IMessage[]
    users: IUser[]
    selectedUser: IUser | null
    isUsersLoading: boolean
    isMessagesLoading: boolean

    getUsers: () => Promise<void>
    getMessages: (userId: IUser["_id"]) => Promise<void>
    setSelectedUser: (selectedUser: IUser | null) => Promise<void>
    sendMessage: (data: IMessage) => Promise<void>
}
