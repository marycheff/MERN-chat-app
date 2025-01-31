import { axiosInstance } from "@/lib/axios"
import { useAuthStore } from "@/store/useAuthStore"
import { ChatState, IMessage } from "@/types/chat.types"

import { IUser } from "@/types/user.types"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { create } from "zustand"

export const useChatStore = create<ChatState>((set, get) => ({
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
    getMessages: async (userId: IUser["_id"]) => {
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
    setSelectedUser: async (selectedUser: IUser | null) => {
        set({ selectedUser })
    },

    subscribeToMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return

        const socket = useAuthStore.getState().socket
        socket?.on("newMessage", (newMessage: IMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
            if (!isMessageSentFromSelectedUser) return //4:08 Чтобы сообщения показывались нужному пользователю
            set({
                messages: [...get().messages, newMessage],
            })
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        socket?.off("newMessage")
    },

    sendMessage: async (data: IMessage) => {
        const { selectedUser, messages } = get()
        try {
            const response = await axiosInstance.post<IMessage>(`/message/send/${selectedUser?._id}`, data)
            set({ messages: [...messages, response.data] })
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Неизвестная ошибка")
            } else {
                toast.error("Неизвестная ошибка, перезагрузите страницу")
            }
        }
    },
}))
