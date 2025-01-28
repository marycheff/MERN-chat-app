export interface IUser {
    _id: string
    fullName: string
    email: string
    profilePic?: string
    createdAt?: Date
    updatedAt?: Date
    __v: number
}
export type ProfileUpdate = {
    profilePic: string | ArrayBuffer | null
}
