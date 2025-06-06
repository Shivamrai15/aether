import { ollama } from "@/lib/ollama";


export const getModels = async()=>{
    const models = await ollama.list();
    return models;
}