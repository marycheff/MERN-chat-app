import { Types, Document } from "mongoose"

export interface IMessage extends Document {
    senderId?: Types.ObjectId 
    receiverId: Types.ObjectId 
    text?: string 
    image?: string 
    createdAt?: Date 
    updatedAt?: Date 
}
