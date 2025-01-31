import config from "@/config"
import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: [config.FRONTEND_URL as string],
    },
})

const userSocketMap: { [key: string]: string } = {}

io.on("connection", socket => {
    console.log("Пользователь подключился", socket.id)

    const userId = socket.handshake.query.userId
    if (userId && typeof userId === "string") {
        userSocketMap[userId] = socket.id
    } else {
        console.log("userId не является строкой:", userId)
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("Пользователь отключился", socket.id)
        if (typeof userId === "string") {
            delete userSocketMap[userId]
            io.emit("getOnlineUsers", Object.keys(userSocketMap))
        }
    })
})

export { app, io, server }
