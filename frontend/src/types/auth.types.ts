import { LoginFormData, SignupFormData } from "@/types/form.types"

import { IUser, ProfileUpdate } from "@/types/user.types"

export interface AuthState {
    authUser: IUser | null
    isSigningUp: boolean
    isLoggingIn: boolean
    isUpdatingProfile: boolean
    isCheckingAuth: boolean

    checkAuth: () => Promise<void>
    signup: (data: SignupFormData) => Promise<void>
    login: (data: LoginFormData) => Promise<void>
    logout: () => Promise<void>
    updateProfile: (data: ProfileUpdate) => Promise<void>
}
