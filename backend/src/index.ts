import { connectDB } from "@/lib/db"
import authRoutes from "@/routes/auth.route"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
dotenv.config()
const PORT = process.env.PORT || 5001
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`✓ Сервер запущен. Порт ${PORT}`)
    connectDB()
})
