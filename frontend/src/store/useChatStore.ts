import { axiosInstance } from "@/lib/axios"
import { ChatState, IMessage } from "@/types/chat.types"

import { IUser } from "@/types/user.types"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { create } from "zustand"

export const useChatStore = create<ChatState>(set => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const response = await axiosInstance.get<IUser[]>("/message/users")
            set({ users: response.data })
            console.log(response.data)
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Неизвестная ошибка")
            } else {
                toast.error("Неизвестная ошибка, перезагрузите страницу")
            }
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (userId: IUser["id"]) => {
        set({ isMessagesLoading: true })
        try {
            const response = await axiosInstance.get<IMessage[]>(`/message/${userId}`)
            set({ messages: response.data })
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Неизвестная ошибка")
            } else {
                toast.error("Неизвестная ошибка, перезагрузите страницу")
            }
        } finally {
            set({ isMessagesLoading: false })
        }
    },
    setSelectedUser: async (selectedUser: IUser) => {
        set({ selectedUser })
        console.log(selectedUser)
    },
}))
