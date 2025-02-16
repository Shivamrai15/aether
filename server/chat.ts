"use server";

import { db } from "@/lib/db";

export const getMessagesByChatId =  async(chatId: string)=> {
    try {
        
        const messages = await db.message.findMany({
            where : {
                chatId
            },
            orderBy : {
                timestamp : "asc"
            }
        });

        return messages;

    } catch (error) {
        console.log("getChatById error", error);
        return [];
    }
}