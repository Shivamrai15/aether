"use client"

import { cn } from "@/lib/utils"
import { AppHeader } from "./app-header"
import { ListResponse } from "ollama";
import { useSidebar } from "@/components/ui/sidebar";


interface MainContentProps {
    children: React.ReactNode;
    models : ListResponse
}

export const MainContent = ({
    children,
    models
}: MainContentProps) => {
    

    const { state } = useSidebar();

    return (
        <div 
            className={cn(
                "h-full bg-neutral-900 relative transition-all",
                state === "collapsed" ? "w-full" : undefined,
            )}
            style={{ width: state !== "collapsed" ? "calc(100% - var(--sidebar-width))" : undefined }}
        >
            <AppHeader models={models} />
            <main className="h-full w-full">
                {children}
            </main>
        </div>
    )
}
