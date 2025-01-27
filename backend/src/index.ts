import config from "@/config"
import { connectDB } from "@/lib/db"
import authRoutes from "@/routes/auth.route"
import messageRoutes from "@/routes/message.route"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(
    cors({
        origin: config.FRONTEND_URL as string,
        credentials: true,
    })
)

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(config.PORT, () => {
    console.log(`✓ Сервер запущен. Порт ${config.PORT}`)
    connectDB()
})
