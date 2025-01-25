import { IUser } from "@/types/user.types"
import "express"

declare module "express" {
    interface Request {
        user?: IUser
    }
}
