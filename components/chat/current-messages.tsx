"use client";

import { useEffect, useRef } from "react";
import { useMessage } from "@/hooks/use-message";
import { UserMessage } from "./user-message";
import { AIMessage } from "./ai-message";

interface CurrentMessagesProps {
    chatId: string;
}

export const CurrentMessages = ({ chatId }: CurrentMessagesProps) => {
    
    const ref = useRef<HTMLDivElement>(null);
    const { messages, getMessages } = useMessage();

    useEffect(()=>{
        if (ref.current) {
            ref.current.scrollIntoView();
        }
    }, [messages, getMessages]);

    return (
        <>
            {
                getMessages(chatId).map((message)=>(
                    message.role === "USER"
                        ? (<UserMessage key={message.id} message={message} />)
                        : (<AIMessage key={message.id} message={message} />)
                ))
            }
            <div className='h-0' ref={ref} />
        </>

    )
}
