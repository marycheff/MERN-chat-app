import cloudinary from "@/lib/cloudinary"
import { generateToken } from "@/lib/utils"
import User from "@/models/user.model"
import { IUser } from "@/types/user.types"
import bcrypt from "bcryptjs"
import { Request, Response } from "express"

export const signup = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            res.status(400).json({ message: "Не все данные предоставлены" })
            return
        }
        if (password.length < 6) {
            res.status(400).json({ message: "Пароль должен состоять как минимум из 6 символов" })
            return
        }
        const user: IUser | null = await User.findOne({ email })
        if (user) {
            res.status(400).json({ message: "Пользователь с таким email уже существует" })
            return
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser: IUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({ message: "Неверные данные пользователя" })
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Ошибка в контроллере регистрации", error.message)
        } else {
            console.log("Неизвестная ошибка в контроллере регистрации", error)
        }
        res.status(500).json({ message: "Ошибка сервера" })
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({ message: "Неверные данные" })
            return
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Неверные данные" })
            return
        }
        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullname: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log("Ошибка в контроллере входа", error.message)
        } else {
            console.log("Неизвестная ошибка в контроллере входа", error)
        }
        res.status(500).json({ message: "Ошибка сервера" })
    }
}

export const logout = (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Успешный выход" })
    } catch (error) {
        if (error instanceof Error) {
            console.log("Ошибка в контроллере выхода", error.message)
        } else {
            console.log("Неизвестная ошибка в контроллере выхода", error)
        }
        res.status(500).json({ message: "Ошибка сервера" })
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { profilePic } = req.body
        const userId = req.user?._id
        if (!profilePic) {
            res.status(400).json({ message: "Картинка профиля не предоставлена" })
            return
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        )
        res.status(200).json(updatedUser)
    } catch (error) {
        if (error instanceof Error) {
            console.log("Ошибка в контроллере обновления профиля", error.message)
        } else {
            console.log("Неизвестная ошибка в контроллере обновления профиля", error)
        }
        res.status(500).json({ message: "Ошибка сервера" })
    }
}

export const checkAuth = (req: Request, res: Response) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        if (error instanceof Error) {
            console.log("Ошибка в контроллере checkAuth", error.message)
        } else {
            console.log("Неизвестная ошибка в контроллере checkAuth", error)
        }
        res.status(500).json({ message: "Ошибка сервера" })
    }
}
