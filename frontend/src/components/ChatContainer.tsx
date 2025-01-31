import ChatHeader from "@/components/ChatHeader"
import MessageInput from "@/components/MessageInput"
import MessageSkeleton from "@/components/skeletons/MessageSkeleton"
import { useAuthStore } from "@/store/useAuthStore"
import { useChatStore } from "@/store/useChatStore"
import { IMessage } from "@/types/chat.types"
import { format } from "date-fns"
import { MessageSquareOff } from "lucide-react"

import { useEffect, useRef } from "react"

const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } =
        useChatStore()

    const { authUser } = useAuthStore()
    const messageEndRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id)
            subscribeToMessages()
        }

        return () => unsubscribeFromMessages()
    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages])
    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "instant" })
        }
    }, [messages])
    if (isMessagesLoading)
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        )

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                    messages.map((message: IMessage, index: number) => (
                        <div
                            key={index}
                            className={`chat ${message.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
                            ref={messageEndRef}>
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img
                                        src={
                                            message.senderId === authUser?._id
                                                ? authUser?.profilePic || "/avatar.png"
                                                : selectedUser?.profilePic || "/avatar.png"
                                        }
                                        alt="profilePic"
                                    />
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">
                                    {message.createdAt ? format(new Date(message.createdAt), "HH:mm") : ""}
                                </time>
                            </div>
                            <div className="chat-bubble flex flex-col">
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachments"
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
                            <div className="max-w-md text-center space-y-3">
                                <div className="flex justify-center gap-4 mb-4">
                                    <div className="relative">
                                        <div
                                            className="w-16 h-16 rounded-2xl bg-primary/10 
                                            flex items-center justify-center animate-bounce">
                                            <MessageSquareOff className="w-8 h-8 text-primary " />
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold">Нет сообщений</h2>
                                <p className="text-base-content/60">Начните разговор, отправив первое сообщение!</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <MessageInput />
        </div>
    )
}

export default ChatContainer
