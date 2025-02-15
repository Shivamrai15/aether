import { ChatOllama } from "@langchain/ollama";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

import { db } from "./db";
import { Message, Role } from "@prisma/client";


export const createChain = async (chatId?: string) => {
    
    const model = new ChatOllama({
        // Need to be updated according to the downloaded models 
        model: "deepseek-r1:1.5b", 
        temperature: 0.7,
    });
  
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful AI assistant called Eather."],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
    ]);

    let existingMessages : Message[] = [];
    if (chatId) {
        existingMessages = await db.message.findMany({
            where : {
                chatId : chatId
            },
            orderBy : {
                timestamp : "asc"
            }
        })
    }
    const chatHistory = new ChatMessageHistory();
  
    existingMessages.forEach(message => {
        if (message.role === Role.USER) {
            chatHistory.addUserMessage(message.content);
        } else {
            chatHistory.addAIMessage(message.content);
        }
    });

    const memory = new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
        chatHistory
    });
  
  
    return RunnableSequence.from([
        {
            input: (initialInput) => initialInput.input,
            chat_history: () => memory.chatHistory.getMessages(),
        },
        prompt,
        model,
    ]);
};