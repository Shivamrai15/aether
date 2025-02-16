"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Chat } from "@prisma/client";
import { useMessage } from "@/hooks/use-message";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis, Trash2Icon } from "lucide-react";

interface ChatItemProps {
    chat: Chat
}

export const ChatItem = ({ chat }: ChatItemProps) => {
    
    const router = useRouter();
    const pathname = usePathname();
    const { clear } = useMessage()
    const isActive = pathname.includes(chat.id);
    

    return (
        <div
            className={cn(
                "w-full p-1.5 px-2 flex items-center justify-between gap-3 hover:bg-neutral-800/60 rounded-lg group/item transition-all duration-300 relative",
                isActive && "bg-neutral-800 hover:bg-neutral-800"
            )}
            id={chat.id}
            role="button"
            onClick={()=>{
                clear();
                router.push(`/chat/${chat.id}?chat=recent`);
            }}
        >
            <span className="inline-block flex-1 truncate text-sm text-zinc-300 group-hover/item:text-white font-medium transition-all duration-300">
                {chat.title}
            </span>
            <button
                className={cn(
                    "hidden group-hover/item:block transition-all duration-300 outline-none",
                    isActive && "block"
                )}
            >
                <Trash2Icon className="size-4"/>
            </button>
        </div>
    )
}
