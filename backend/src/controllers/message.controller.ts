import cloudinary from "@/lib/cloudinary"
import Message from "@/models/message.model"
import User from "@/models/user.model"
import { IMessage } from "@/types/message.types"
import { Request, Response } from "express"

export const getUsersForSidebar = async (req: Request, res: Response) => {
    try {
        const loggedUserId = req.user?._id

        // Получить данные всех пользователей (кроме пароля), кроме нас самих
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password")

        res.status(200).json(filteredUsers)
    } catch (error) {
        if (error instanceof Error) {
            console.log("Ошибка в контроллере getUsersForSidebar", error.message)
        } else {
            console.log("Неизвестная ошибка в контроллере getUsersForSidebar", error)
        }
        res.status(500).json({ message: "Ошибка сервера" })
    }
}

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: userToChatID } = req.params
        const myId = req.user?._id
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatID },
                { senderId: userToChatID, receiverId: myId },
            ],
        })

        res.status(200).json(messages)
    } catch (error) {
        if (error instanceof Error) {
            console.log("Ошибка в контроллере getMessages", error.message)
        } else {
            console.log("Неизвестная ошибка в контроллере getMessages", error)
        }
        res.status(500).json({ message: "Ошибка сервера" })
    }
}

export const sendMessages = async (req: Request, res: Response) => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user?._id

        let imageUrl
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage: IMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save()

        // todo: real time functionality goes here socket.io

        res.status(201).json(newMessage)
    } catch (error) {}
}
