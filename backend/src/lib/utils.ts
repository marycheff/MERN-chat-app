
import config from "@/config"
import { Response } from "express"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"
export const generateToken = (userId: Types.ObjectId, res: Response): string => {
    const token = jwt.sign({ userId }, config.JWT_SECRET!, {
        expiresIn: "7d",
    })
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV != "development",
    })
    return token
}
