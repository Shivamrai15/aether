import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"

interface UseModelProps {
    currentModel : string;
    useEmbeddedModel: boolean;
    setCurrentModel : (model: string)=>void;
    setUseEmbeddedModel: (useEmbeddedModel: boolean) => void;
}

export const useModel = create(persist<UseModelProps>((set)=>({
        useEmbeddedModel: false,
        currentModel : "",
        setCurrentModel : (model: string)=>set({currentModel: model}),
        setUseEmbeddedModel: (useEmbeddedModel: boolean) => set({useEmbeddedModel})
    }),
    {
        name: "model-storage",
        storage: createJSONStorage(() => localStorage)
    }  
))