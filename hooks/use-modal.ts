import { create } from "zustand";

interface UseModalProps {
    chatId: string;
    setChatId : (id: string)=>void;
    onClose : ()=>void;
}

export const useModal = create<UseModalProps>((set)=>({
    chatId : "",
    setChatId : (id: string)=>set({chatId: id}),
    onClose : ()=>set({chatId: ""})
}));