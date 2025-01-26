import config from "@/config"
import User from "@/models/user.model"
import { JwtPayload } from "@/types/jwt.types"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            res.status(401).json({ message: "Не авторизован. Нет токена" })
            return
        }


        const decoded = jwt.verify(token, config.JWT_SECRET!) as JwtPayload

        if (!decoded) {
            res.status(401).json({ message: "Не авторизован. Токен не валиден" })
            return
        }

        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            res.status(404).json({ message: "Пользователь не найден" })
            return
        }
        req.user = user

        next()
    } catch (error) {
        if (error instanceof Error) {
            console.log("Ошибка в middleware protectRoute", error.message)
        } else {
            console.log("Неизвестная ошибка в middleware protectRoute", error)
        }
        res.status(500).json({ message: "Ошибка сервера" })
    }
}
