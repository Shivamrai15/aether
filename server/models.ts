import { Ollama } from "ollama";

export const getModels = async()=>{
    const ollama = new Ollama();
    const models = await ollama.list();
    return models;
}