import config from "@/config"
import { connectDB } from "@/lib/db"
import { app, server } from "@/lib/socket"
import authRoutes from "@/routes/auth.route"
import messageRoutes from "@/routes/message.route"
import cookieParser from "cookie-parser"
import cors from "cors"

import express, { Request, Response } from "express"



app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())

app.use(
    cors({
        origin: config.FRONTEND_URL as string,
        credentials: true,
    })
)
app.get("/", (req: Request, res: Response) => {
    res.send("Сервер работает")
})
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

server.listen(config.PORT, () => {
    console.log(`✓ Сервер запущен. Порт ${config.PORT}`)
    connectDB()
})
