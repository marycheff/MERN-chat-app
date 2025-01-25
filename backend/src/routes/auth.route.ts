import { login, logout, signup, updateProfile } from "@/controllers/auth.controller"
import { protectRoute } from "@/middleware/auth.middleware"
import express from "express"

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile)

export default router
