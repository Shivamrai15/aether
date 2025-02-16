import { Message } from "@prisma/client";
import { create } from "zustand";

interface UseMessageProps {
    messages : Message[];
    createMessage : ( message: Message )=>void;
    updateMessage : ( content: string, chatId: string )=>void;
    getMessages : ( chatId: string )=>Message[];
    clear : ()=>void;
}

export const useMessage = create<UseMessageProps>(((set, get)=>({
    messages : [],
    createMessage : ( message : Message )=>set({ messages : [...get().messages, message]}),
    updateMessage : ( content: string, chatId: string )=>{
        set((state) => ({
            messages: state.messages.map((message) =>
                message.chatId === chatId && message.role==="ASSISTANT"
                    ? { ...message, content: message.content + content }
                    : message
            ),
        }));
    },
    getMessages : (chatId: string)=>{
        return get().messages.filter((message)=>message.chatId===chatId);
    },
    clear : ()=>set({ messages: [] })
})));