import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"

interface UseModelProps {
    currentModel : string;
    setCurrentModel : (model: string)=>void;
}

export const useModel = create(persist<UseModelProps>((set)=>({
        currentModel : "",
        setCurrentModel : (model: string)=>set({currentModel: model})
    }),
    {
        name: "model-storage",
        storage: createJSONStorage(() => localStorage)
    }  
))