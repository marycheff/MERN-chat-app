import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from "@/routes/auth.route"
import messageRoutes from "@/routes/message.route"
import { connectDB } from "@/lib/db"
import config from "@/config"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: config.FRONTEND_URL,
        credentials: true,
    })
)

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(config.PORT, () => {
    console.log(`✓ Сервер запущен. Порт ${config.PORT}`)
    console.log(`✓ Режим: ${config.NODE_ENV}`)
    connectDB()
})
