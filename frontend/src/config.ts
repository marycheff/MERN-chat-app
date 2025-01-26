const requiredEnvVars = ["VITE_API_URL"]

const config: Record<string, string> = {}

for (const envVar of requiredEnvVars) {
    const value = import.meta.env[envVar]
    if (!value) {
        throw new Error(`Отсутствует переменная окружения: ${envVar}`)
    }
    config[envVar] = value
}
export default {
    VITE_API_URL: import.meta.env.VITE_API_URL,
}
