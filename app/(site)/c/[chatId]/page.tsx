import { notFound } from "next/navigation";
import { Message } from "@prisma/client";
import { AIMessage } from "@/components/chat/ai-message";
import { CurrentMessages } from "@/components/chat/current-messages";
import { UserMessage } from "@/components/chat/user-message";
import { getMessagesByChatId } from "@/server/chat";


interface PageProps {
    params : Promise<{ chatId : string|undefined }>;
    searchParams: Promise<{
        chat : string | undefined | string[];
    }>;
}



const Page = async({
    params,
    searchParams
}: PageProps ) => {
    
    const { chatId } = await params;
    if (!chatId) {
        notFound();
    }
    const chatQuery = (await searchParams).chat as string | undefined;
    let previousMessages : Message[] = [];
    
    if (chatQuery && chatQuery === "recent") {
        previousMessages = await getMessagesByChatId(chatId)
    }

    return (
        <div className="h-full w-full max-w-3xl mx-auto px-8 pt-20 pb-10 flex flex-col gap-y-10">
            {
                previousMessages.map((message)=>(
                    message.role === "USER"
                    ? (<UserMessage key={message.id} message={message} />)
                    : (<AIMessage key={message.id} message={message} />)
                ))
            }
            <CurrentMessages chatId={chatId} />
        </div>
    )
}

export default Page;