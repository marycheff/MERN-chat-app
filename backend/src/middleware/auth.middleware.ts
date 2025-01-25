import User from "@/models/user.model"
import { IUser } from "@/types/user.types"
import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            res.status(401).json({ message: "Не авторизован. Нет токена" })
            return
        }

        if (!process.env.JWT_SECRET) throw new Error("Нет JWT_SECRET в .env")
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

        if (!decoded) {
            res.status(401).json({ message: "Не авторизован. Токен не валиден" })
            return
        }

        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            res.status(404).json({ message: "Пользователь не найден" })
            return
        }
        // Object.assign(req, { user });
        ;(req as any).user = user

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
