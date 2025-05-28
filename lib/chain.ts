import { ChatOllama } from "@langchain/ollama";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

import { db } from "./db";
import { Message, Role } from "@prisma/client";

/**
 * Creates and returns a chain for processing chat messages.
 * Optionally loads existing chat history from the database using a given chatId.
 */
export const createChain = async (chatId?: string, modelName?: string) => {
    
    // Initialize the ChatOllama model with the specified parameters.
    const model = new ChatOllama({
        // Update according to the downloaded models 
        model: modelName, 
        temperature: 0.5,
    });
  
    // Define the prompt template with a system message, chat history placeholder, and human input
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful AI assistant called Eather. Use emojis where appropriate to make responses more engaging 😊."],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
    ]);

    // Retrieve existing chat messages from the database if chatId is provided.
    let existingMessages: Message[] = [];
    if (chatId) {
        existingMessages = await db.message.findMany({
            where: {
                chatId: chatId
            },
            orderBy: {
                timestamp: "asc"
            }
        })
    }

    // Setup an in-memory chat history and populate it with existing messages.
    const chatHistory = new ChatMessageHistory();
  
    // Add messages to the chat history based on their role.
    existingMessages.forEach(message => {
        if (message.role === Role.USER) {
            chatHistory.addUserMessage(message.content);
        } else {
            chatHistory.addAIMessage(message.content);
        }
    });

    // Initialize buffer memory using the chat history.
    const memory = new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
        chatHistory
    });
  
    // Combine the input transformation, prompt, and model into a chain sequence.
    return RunnableSequence.from([
        {
            // Transform the user input to use only the "input" property.
            input: (initialInput) => initialInput.input,
            // Retrieve the chat history messages from the buffer memory.
            chat_history: () => memory.chatHistory.getMessages(),
        },
        prompt,
        model,
    ]);
};