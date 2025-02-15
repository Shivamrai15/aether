import { NextResponse } from "next/server";
import { InputSchema } from "@/schemas/input.schema";
import { createChain } from "@/lib/chain";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";


export async function POST ( req: Request ) {
    try {
        
        const body = await req.json();
        const validatedData = await InputSchema.safeParseAsync(body);

        if (!validatedData.success) {
            return new NextResponse("Invalid input fields", {status: 401});
        }

        const { chatId, input } = validatedData.data;
        const chain = await createChain(chatId);

        let newChatId : string = "";
        if (!chatId) {
            const chat = await db.chat.create({
                data : {
                    title : input
                }
            });
            newChatId = chat.id;
        }

        if (!chatId && !newChatId) {
            return new NextResponse("Chat ID is missing", { status: 400 });
        }

        await db.message.create({
            data : {
                chatId : chatId||newChatId,
                content : input,
                role : Role.USER,
            }
        });

        const encoder = new TextEncoder();
        let aiMessage = "";

        const stream = new ReadableStream({
            async start(controller) {
                const response = await chain.stream({input});
                for await (const token of response) {
                    aiMessage += `${token.content}`
                    controller.enqueue(encoder.encode(`${token.content}`));
                }

                await db.message.create({
                    data : {
                        chatId : chatId||newChatId,
                        content : aiMessage,
                        role : Role.ASSISTANT
                    }
                });

                controller.close();
            }
        });

        return new NextResponse(stream, {
            headers: { 
                "Content-Type": "text/event-stream",
                "Connection": "keep-alive",
                "Cache-Control": "no-cache, no-transform",
            },
        });

    } catch (error) {
        console.log("CHAT POST API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}