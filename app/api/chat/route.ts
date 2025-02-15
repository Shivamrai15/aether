import { NextResponse } from "next/server";
import { InputSchema } from "@/schemas/input.schema";
import { createChain } from "@/lib/chain";
import { db } from "@/lib/db";
import { Chat, Role } from "@prisma/client";


const BATCH = 10

export async function POST ( req: Request ) {
    try {
        
        const body = await req.json();
        const validatedData = await InputSchema.safeParseAsync(body);

        if (!validatedData.success) {
            return new NextResponse("Invalid input fields", {status: 401});
        }

        const { chatId, input, newChat } = validatedData.data;
        const chain = await createChain(chatId);

        if (newChat) {
            await db.chat.create({
                data : {
                    id: chatId,
                    title : input
                }
            });
        }

        await db.message.create({
            data : {
                chatId : chatId,
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
                        chatId : chatId,
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


export async function GET ( req: Request ) {
    try {
        
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");

        let chats : Chat[]=[];
        if (cursor) {
            chats = await db.chat.findMany({
                cursor : {
                    id : cursor
                },
                skip : 1,
                take : BATCH,
                orderBy : {
                    createdAt : "desc"
                }
            });
        } else {
            chats = await db.chat.findMany({
                take : BATCH,
                orderBy : {
                    createdAt : "desc"
                }
            });
        }

        let nextCursor = null;
        if ( chats.length===BATCH ) {
            nextCursor = chats[BATCH-1].id
        }

        return NextResponse.json({
            items : chats,
            nextCursor
        });

    } catch (error) {
        console.log("CHAT GET API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}