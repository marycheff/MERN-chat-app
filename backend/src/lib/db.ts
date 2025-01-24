import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) throw new Error("Не задана строка MONGODB_URI в .env")
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`✓ Подключено к MongoDB. ${conn.connection.host}`)
    } catch (error) {
        console.log("Ошибка подключения к БД", error)
    }
}
