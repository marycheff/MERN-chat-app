import { useChatStore } from "@/store/useChatStore"
import { IMessage } from "@/types/chat.types"
import { Image, Send, X } from "lucide-react"
import { FormEvent, useRef, useState } from "react"
import toast from "react-hot-toast"

const MessageInput = () => {
    const [text, setText] = useState("")
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null)
    const { sendMessage } = useChatStore()

    const handleImageChange = (e: FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement
        if (target.files && target.files[0]) {
            const file = target.files[0]
            if (!file || !file.type.startsWith("image/")) {
                toast.error("Выберите изображение")
                return
            }
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = async () => {
                const base64Image = reader.result
                setImagePreview(base64Image)
            }
        }
        return
    }
    const removeImage = () => {
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }
    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!text.trim() && !imagePreview) return

        try {
            const message: IMessage = {
                //    receiverId: "yourReceiverId", // Replace with the actual receiver ID
                text: text.trim(),
                image: imagePreview ? (imagePreview as string) : undefined,
            }

            await sendMessage(message)

            setText("")
            setImagePreview(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        } catch (error) {
            console.error("Ошибка отправки сообщения", error)
        }
    }
    return (
        <div className="p-4 w-full">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview as string}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="
                            absolute -top-1.5 -right-1.5 w-5 h-5 
                            rounded-full bg-base-300
                            flex items-center justify-center
                            "
                            type="button">
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Введите сообщение"
                        value={text}
                        onChange={e => {
                            setText(e.target.value)
                        }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <button
                        type="button"
                        className={`
                            hidden sm:flex btn btn-circle 
                            ${imagePreview ? "text-emerald-500" : "text-zinc-400"}
                         `}
                        onClick={() => fileInputRef.current?.click()}>
                        <Image size={20} />
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle text-zinc-400"
                    disabled={!text.trim() && !imagePreview}>
                    <Send size={22} />
                </button>
            </form>
        </div>
    )
}

export default MessageInput
