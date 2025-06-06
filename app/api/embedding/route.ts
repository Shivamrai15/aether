import { db } from "@/lib/db";
import { ollama } from "@/lib/ollama";
import { InputSchema } from "@/schemas/input.schema";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST ( req: Request ) {
    try {
        
        const body = await req.json();
        const validatedData = await InputSchema.safeParseAsync(body);

        if (!validatedData.success) {
            return new NextResponse("Invalid input fields", {status: 401});
        }

        const { chatId, input, newChat, model } = validatedData.data;

        if (newChat) {
            await db.chat.create({
                data : {
                    id: chatId,
                    title : input,
                    type : "EMBEDDING"
                }
            });
        }

        await db.message.create({
            data : {
                chatId : chatId,
                content : input,
                role : Role.USER,
                model : model,
            }
        });

        const embedding = await ollama.embeddings({
            model: model,
            prompt: input,
            options : {

            }
        });

        const embeddingData = JSON.stringify(embedding.embedding);
        const message = await db.message.create({
            data : {
                chatId : chatId,
                content : embeddingData,
                role : Role.USER,
                model : model,
            }
        });

        return NextResponse.json(message);
        

    } catch (error) {
        console.log("CHAT POST API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}