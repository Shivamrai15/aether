import { 
    useSidebar,
    SidebarTrigger
} from "@/components/ui/sidebar";


export const AppHeader = () => {

    const { state } = useSidebar();

    return (
        <header className="h-14 w-full flex items-center justify-between gap-x-4 fixed top-0">
            <div className="flex items-center gap-x-4">
                {
                    state === "collapsed" && (
                        <SidebarTrigger className="size-9 p-1.5"/>
                    )
                }
            </div>
        </header>
    )
}
