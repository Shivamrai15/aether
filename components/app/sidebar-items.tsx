"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { AlertTriangle, Loader } from "lucide-react";
import { groupChatsByDate } from "@/lib/chats";
import { SidebarGroup } from "@/components/ui/sidebar";
import { ChatItem } from "./chat-item";


const fetchChats = async({pageParam = undefined}) => {
    const url =  qs.stringifyUrl({
        url : "/api/chat",
        query : {
            cursor : pageParam
        }
    }, {skipNull: true});

    const res = await fetch(url, {cache : "no-store"});
    return res.json();
}

export const SidebarItems = () => {

    const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery({
        initialPageParam : undefined,
        queryKey : ["chat:get"],
        queryFn : fetchChats,
        getNextPageParam: (lastPage)=>lastPage?.nextCursor,
        refetchInterval : false
    });

    if (isPending) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader className="size-6 text-zinc-500 animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center gap-y-2">
                <AlertTriangle className="size-6 text-zinc-500"/>
                <p className="text-zinc-500 text-sm font-medium text-center">Something went wrong</p>
            </div>
        );
    }

    const chats = data?.pages.flatMap((page) => page.items) || [];
    const { today, yesterday, last7Days, last30Days, monthly } = groupChatsByDate(chats);
    
    return (
        <div className="w-full flex flex-col gap-y-6">
            {
                today.length !==0 && (
                    <SidebarGroup>
                        <h2 className="px-2 text-xs font-semibold w-full mb-2">Today</h2>
                        {
                            today.map((chat)=>(
                                <ChatItem
                                    key={chat.id}
                                    chat={chat}
                                />
                            ))
                        }
                    </SidebarGroup>
                )
            }
            {
                yesterday.length !==0 && (
                    <SidebarGroup>
                        <h2 className="px-2 text-xs font-semibold w-full mb-2">Yesterday</h2>
                        {
                            yesterday.map((chat)=>(
                                <ChatItem
                                    key={chat.id}
                                    chat={chat}
                                />
                            ))
                        }
                    </SidebarGroup>
                )
            }
            {
                last7Days.length !==0 && (
                    <SidebarGroup>
                        <h2 className="px-2 text-xs font-semibold w-full mb-2">Previous 7 Days</h2>
                        {
                            last7Days.map((chat)=>(
                                <ChatItem
                                    key={chat.id}
                                    chat={chat}
                                />
                            ))
                        }
                    </SidebarGroup>
                )
            }
            {
                last30Days.length !==0 && (
                    <SidebarGroup>
                        <h2 className="px-2 text-xs font-semibold w-full mb-2">Previous 30 Days</h2>
                        {
                            last30Days.map((chat)=>(
                                <ChatItem
                                    key={chat.id}
                                    chat={chat}
                                />
                            ))
                        }
                    </SidebarGroup>
                )
            }
            {
                Object.entries(monthly).map(([month, chats])=>(
                    chats.length > 0
                    ? (
                        <SidebarGroup>
                            <h2 className="px-2 text-xs font-semibold w-full mb-2">{month}</h2>
                            {
                                chats.map((chat)=>(
                                    <ChatItem
                                        key={chat.id}
                                        chat={chat}
                                    />
                                ))
                            }
                        </SidebarGroup> 
                    )
                    : null
                ))
            }
        </div>
    )
}
