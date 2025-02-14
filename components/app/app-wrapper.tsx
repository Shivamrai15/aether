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
            <div className="h-full bg-neutral-900 w-full px-6 relative">
                <AppHeader/>
                <main className="h-full w-full max-w-2xl mx-auto">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
