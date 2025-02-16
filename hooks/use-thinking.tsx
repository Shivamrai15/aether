import { create } from "zustand";

interface UseThinkingProps {
    loadingId : string;
    setLoadingId : (id: string)=>void;
}

export const useThinking = create<UseThinkingProps>(((set)=>({
    loadingId : "",
    setLoadingId : (id: string)=>set({loadingId : id})
})));