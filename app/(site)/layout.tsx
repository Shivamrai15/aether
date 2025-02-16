import { MessageBox } from "@/components/chat/message-box";

interface LayoutProps {
    children : React.ReactNode;
}

const Layout = ({ children } : LayoutProps) => {
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
            <div className="max-w-3xl w-full px-6 mx-auto">
                <MessageBox/>
                <p className="text-zinc-500 text-xs font-medium py-2 text-center">Eather can make mistakes</p>
            </div>
        </div>
    )
}

export default Layout;