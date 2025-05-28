import { Message } from "@prisma/client"

interface UserMessageProps {
    message : Message;
}

export const UserMessage = ({ message } : UserMessageProps) => {
    return (
        <div className="w-full max-w-md rounded-xl md:rounded-2xl ml-auto p-3 md:px-5 bg-neutral-800 text-zinc-200">
            <pre className="text-zinc-200 text-[15px] whitespace-pre-wrap font-sans">
                {message.content}
            </pre>
        </div>
    )
}
