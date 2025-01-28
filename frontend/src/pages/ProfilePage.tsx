import { useAuthStore } from "@/store/useAuthStore"
import { format } from "date-fns"
import { Camera, Mail, User } from "lucide-react"
import { FormEvent, useState } from "react"

const ProfilePage = () => {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null)
    const handleImageUpload = async (e: FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement
        if (target.files && target.files[0]) {
            const file = target.files[0]
            if (!file) return
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = async () => {
                const base64Image = reader.result
                setSelectedImage(base64Image)
                await updateProfile({profilePic: base64Image})
            }
        }
        return
    }

    return (
        <div className="h-screen pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Профиль</h1>
                        <p className="mt-2">Информация о вашем профиле</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img
                                src={
                                    typeof selectedImage === "string"
                                        ? selectedImage
                                        : authUser?.profilePic || "/avatar.png"
                                }
                                alt="Профиль"
                                className="size-32 rounded-full object-cover border-4"
                            />

                            <label
                                htmlFor="avatar-upload"
                                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}>
                                <Camera className="w-5 h-5 text-base-200" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept=".png, .jpg, .jpeg"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-400">
                            {isUpdatingProfile
                                ? "Загрузка..."
                                : "Нажмите на значок камеры, чтобы обновить свою фотографию"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Имя
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                        </div>
                    </div>

                    <div className="mt-6 bg-base-300 rounded-xl p-6">
                        <h2 className="text-lg font-medium mb-4">Информация об аккаунте</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                <span>Аккаунт зарегистрирован</span>
                                <span>
                                    {authUser?.createdAt ? format(new Date(authUser.createdAt), "dd.MM.yyyy") : ""}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span>Статус аккаунта</span>
                                <span className="text-green-500">Активен</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
