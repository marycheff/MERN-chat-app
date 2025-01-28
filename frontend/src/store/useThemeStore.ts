import { ThemeState } from "@/types/theme.types"
import { create } from "zustand"

export const useThemeStore = create<ThemeState>(set => ({
    theme: localStorage.getItem("theme") || "retro",
    setTheme: (theme: string) => {
        localStorage.setItem("theme", theme)
        set({ theme })
    },
}))
