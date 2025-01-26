import config from "@/config"
import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: config.VITE_API_URL as string,
    withCredentials: true,
})
