"use client";


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger
  } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PencilIcon, Search } from "lucide-react";
import { SidebarItems } from "./sidebar-items";
import { useRouter } from "next/navigation";


export const AppSidebar = () => {
    
    const router = useRouter();

    return (
        <Sidebar className="bg-[#0e0e0e] h-full">
            <SidebarHeader className="bg-[#0e0e0e] flex flex-row items-center justify-between" >
                <SidebarTrigger className="size-9 p-1.5 text-zinc-400" />
                <div className="flex items-center gap-x-1">
                    <Button
                        className="size-9 p-1.5 text-zinc-400"
                        variant="ghost"
                        size="icon"
                    >
                        <Search />
                    </Button>
                    <Button
                        className="size-9 p-1.5 text-zinc-400"
                        variant="ghost"
                        size="icon"
                        onClick={()=>router.push("/")}
                    >
                        <PencilIcon className="size-5" />
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-[#0e0e0e] px-1">
                <SidebarItems/>
            </SidebarContent>
            <SidebarFooter className="bg-[#0e0e0e]" />
        </Sidebar>
    )
}
  