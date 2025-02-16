"use client";

import { useEffect, useRef } from "react";
import { useMessage } from "@/hooks/use-message";
import { UserMessage } from "./user-message";
import { AIMessage } from "./ai-message";
import { useThinking } from "@/hooks/use-thinking";
import { SyncLoader } from "react-spinners";

interface CurrentMessagesProps {
    chatId: string;
}

export const CurrentMessages = ({ chatId }: CurrentMessagesProps) => {
    
    const ref = useRef<HTMLDivElement>(null);
    const { messages, getMessages } = useMessage();
    const { loadingId } = useThinking();

    useEffect(()=>{
        if (ref.current) {
            ref.current.scrollIntoView();
        }
    }, [messages, getMessages]);

    return (
        <>
            {
                getMessages(chatId).map((message, idx)=>(
                    <>
                        {
                            (idx === messages.length-1) && message.role==="ASSISTANT" && loadingId===chatId && (
                                <div className="flex py-2 items-center justify-start">
                                    <SyncLoader color="#252525" />
                                </div>
                            )
                        }
                        {
                            message.role === "USER"
                            ? (<UserMessage key={message.id} message={message} />)
                            : (<AIMessage key={message.id} message={message} />)
                        }
                    </>
                ))
            }
            <div className='h-0' ref={ref} />
        </>

    )
}
