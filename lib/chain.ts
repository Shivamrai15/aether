import { ChatOllama } from "@langchain/ollama";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

import { db } from "./db";


export const createChain = async (chatId: string) => {
    
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

    const existingMessages = await db.messages
      .where('chatId')
      .equals(chatId)
      .sortBy('timestamp');

    const chatHistory = new ChatMessageHistory();
  
    existingMessages.forEach(message => {
        if (message.role === 'user') {
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