import config from "@/config" // Импортируем конфигурацию
import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGODB_URI!)
        console.log(`✓ Подключено к MongoDB. ${conn.connection.host}`)
    } catch (error) {
        console.log("Ошибка подключения к БД", error)
    }
}
