import { axiosInstance } from "@/lib/axios"
import { AuthState } from "@/types/auth.types"
import { LoginFormData, SignupFormData } from "@/types/form.types"

import { IUser, ProfileUpdate } from "@/types/user.types"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { create } from "zustand"

export const useAuthStore = create<AuthState>(set => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get<IUser>("/auth/check")
            set({ authUser: response.data })
        } catch (error) {
            console.log("Ошибка в checkAuth: ", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data: SignupFormData) => {
        set({ isSigningUp: true })
        try {
            const response = await axiosInstance.post("auth/signup", data)
            set({ authUser: response.data })
            toast.success("Аккаунт успешно создан")
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Неизвестная ошибка")
            } else {
                toast.error("Неизвестная ошибка, перезагрузите страницу")
            }
        } finally {
            set({ isSigningUp: false })
        }
    },
    login: async (data: LoginFormData) => {
        set({ isLoggingIn: true })
        try {
            const response = await axiosInstance.post("auth/login", data)
            set({ authUser: response.data })
            toast.success("Успешный вход")
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Неизвестная ошибка")
            } else {
                toast.error("Неизвестная ошибка, перезагрузите страницу")
            }
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("auth/logout")
            set({ authUser: null })
            toast.success("Успешный выход")
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Неизвестная ошибка")
            } else {
                toast.error("Неизвестная ошибка, перезагрузите страницу")
            }
        }
    },

    updateProfile: async (data: ProfileUpdate) => {
        set({ isUpdatingProfile: true })

        try {
            const response = await axiosInstance.put("auth/update-profile", data)
            set({ authUser: response.data })
            toast.success("Профиль успешно обновлен")
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Неизвестная ошибка")
            } else {
                toast.error("Неизвестная ошибка, перезагрузите страницу")
            }
        } finally {
            set({ isUpdatingProfile: false })
        }
    },
}))
