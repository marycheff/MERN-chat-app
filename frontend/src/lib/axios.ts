import axios from "axios"
const baseURL = import.meta.env.VITE_API_URL
if (!baseURL) throw new Error("Нет VITE_API_URL в файле .env")

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true
})
