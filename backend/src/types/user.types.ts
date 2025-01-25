import { Document, Types } from "mongoose"

export interface IUser extends Document {
    _id: Types.ObjectId
    fullName: string
    email: string
    password: string
    profilePic?: string
    createdAt?: Date
    updatedAt?: Date
}
