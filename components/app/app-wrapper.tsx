"use client";

import {
    SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { ListResponse } from "ollama";
import { MainContent } from "./main-content";


interface AppWrapper {
    children: React.ReactNode;
    models : ListResponse
}


export const AppWrapper = ({
    children,
    models
}: AppWrapper) => {

    return (
        <SidebarProvider
            className="h-full w-full flex"
        >
            <AppSidebar />
            <MainContent models={models} >
                {children}
            </MainContent>
        </SidebarProvider>
    )
}
