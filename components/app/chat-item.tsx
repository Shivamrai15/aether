"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Chat } from "@prisma/client";

interface ChatItemProps {
    chat: Chat
}

export const ChatItem = ({ chat }: ChatItemProps) => {
    
    const pathname = usePathname();
    const isActive = pathname.includes(chat.id)
    
    return (
        <Link
            href={`/chat/${chat.id}?chat=recent`}
            className={cn(
                "w-full p-1.5 px-2 overflow-hidden flex items-center justify-between gap-3 hover:bg-neutral-800/60 rounded-lg group/item transition-all duration-300",
                isActive && "bg-neutral-800 hover:bg-neutral-800"
            )}
        >
            <span className="inline-block flex-1 truncate text-sm text-zinc-300 group-hover/item:text-white font-medium transition-all duration-300">
                {chat.title}
            </span>
        </Link>
    )
}
