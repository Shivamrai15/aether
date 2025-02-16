"use client";

import {
    SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";


interface AppWrapper {
    children: React.ReactNode;
}


export const AppWrapper = ({
    children
}: AppWrapper) => {

    return (
        <SidebarProvider
            className="h-full w-full"
        >
            <AppSidebar />
            <div className="h-full bg-neutral-900 w-full relative">
                <AppHeader/>
                <main className="h-full w-full">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
