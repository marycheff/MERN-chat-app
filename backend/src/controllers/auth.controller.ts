import { generateToken } from "@/lib/utils"
import User from "@/models/user.model"
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
        const user = await User.findOne({ email })
        if (user) {
            res.status(400).json({ message: "Пользователь с таким email уже существует" })
            return
        }
        const salt = await bcrypt.genSalt(9)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
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
                // profilePic: newUser.profilePic,
                
                // message: "Успешная регистрация",
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
        res.status(500).json({ message: "Внутренняя ошибка сервера" })
    }
}
export const login = (req: Request, res: Response) => {
    res.send("login route")
}
export const logout = (req: Request, res: Response) => {
    res.send("logout route")
}
