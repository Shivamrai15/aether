import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { InputSchema } from "@/schemas/input.schema";
import { createChain } from "@/lib/chain";


export async function POST ( req: Request ) {
    try {
        
        const body = await req.json();
        const validatedData = await InputSchema.safeParseAsync(body);

        if (!validatedData.data) {
            return new NextResponse("Invalid input fields", {status: 401});
        }

        const { chatId, input } = validatedData.data;

        const chain = await createChain(chatId);
        const response = await chain.invoke({input});

        return NextResponse.json(response);

    } catch (error) {
        console.log("CHAT POST API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}