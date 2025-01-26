import { IUser } from "@/types/user.types"

export interface AuthState {
    authUser: IUser | null
    isSigningUp: boolean
    isLoggingIn: boolean
    isUpdatingProfile: boolean
    isCheckingAuth: boolean

    checkAuth: () => Promise<void>
    signup: () => Promise<void>
}
