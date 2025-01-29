import { IUser } from "@/types/user.types"

export interface IMessage {
    id: string
    senderId: string
    receiverId: string
    text?: string
    image?: string
    createdAt: string
    updatedAt: string
}

export interface ChatState {
    messages: IMessage[]
    users: IUser[]
    selectedUser: IUser | null
    isUsersLoading: boolean
    isMessagesLoading: boolean

    getUsers: () => Promise<void>
    getMessages: (userId: IUser["id"]) => Promise<void>
    setSelectedUser: (selectedUser: IUser) => Promise<void>
}
