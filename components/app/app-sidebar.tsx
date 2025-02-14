"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarTrigger
  } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PencilIcon, Search } from "lucide-react";

export const AppSidebar = () => {
    return (
        <Sidebar className="bg-neutral-950 h-full">
            <SidebarHeader className="bg-neutral-950 flex flex-row items-center justify-between" >
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
                    >
                        <PencilIcon className="size-5" />
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-neutral-950">
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter className="bg-neutral-950" />
        </Sidebar>
    )
}
  