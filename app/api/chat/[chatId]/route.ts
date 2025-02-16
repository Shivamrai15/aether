import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE (
    req: Request,
    { params } : { params : { chatId: string } }
) {
    try {
        
        const chat = await db.chat.delete({
            where : {
                id: params.chatId
            }
        });

        return NextResponse.json({
            success: true,
            message : "Chat has been deleted successfully",
            data : chat
        });


    } catch (error) {
        console.log("CHAT DELETE API ERROR");
        return new NextResponse("Internal server error", {status: 500});
    }
}