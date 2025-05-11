import { 
    useSidebar,
    SidebarTrigger
} from "@/components/ui/sidebar";
import { ListResponse } from "ollama";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useModel } from "@/hooks/use-models";
import { CheckIcon } from "lucide-react";

interface AppHeaderProps {
    models : ListResponse
}

export const AppHeader = ({
    models
}: AppHeaderProps) => {

    const { state } = useSidebar();
    const { currentModel, setCurrentModel } = useModel();

    return (
        <header 
            className={cn(
                "h-14 flex items-center justify-between gap-x-4 fixed top-0 px-6 bg-neutral-900 z-10",
                state === "collapsed" ? "w-full" : undefined,
            )}
            style={{ width: state !== "collapsed" ? "calc(100% - var(--sidebar-width))" : undefined }}
        >
            <div className="w-full flex items-center justify-between gap-x-4">
                <div>
                    {
                        state === "collapsed" && (
                            <SidebarTrigger className="size-9 p-1.5"/>
                        )
                    }
                </div>
                <div className="flex items-center gap-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="rounded-2xl"
                            >
                                Models
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-52 bg-neutral-800 p-2 py-3 rounded-2xl"
                        >
                            {
                                models.models.map((model)=>(
                                    <DropdownMenuItem
                                        key={model.name}
                                        onClick={()=>setCurrentModel(model.name)}
                                        className="text-sm flex items-center justify-between font-medium text-neutral-300 focus:text-zinc-50 focus:bg-neutral-700 rounded-xl md:cursor-pointer"
                                    >
                                        <span className="line-clamp-1">
                                            {model.name}
                                        </span>
                                        {
                                            currentModel === model.name && (
                                                <CheckIcon className="h-4"/>
                                            )
                                        }
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
