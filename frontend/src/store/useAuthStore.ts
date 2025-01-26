import { axiosInstance } from "@/lib/axios"
import { AuthState } from "@/types/auth.types"
import { SignupFormData } from "@/types/form.types"
import { IUser } from "@/types/user.types"
import { create } from "zustand"

export const useAuthStore = create<AuthState>(set => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get<{ data: IUser }>("/auth/check")
            set({ authUser: response.data.data })
        } catch (error) {
            console.log("Ошибка в checkAuth: ", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data: SignupFormData) => {},
}))
