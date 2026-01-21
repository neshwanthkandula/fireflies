'use client'

import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./landing/app-sidebar";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { isSignedIn } = useAuth()

    const showSidebar = pathname !== "/" && !(pathname.startsWith("/meeting/") && !isSignedIn)
    console.log("isSignedin", isSignedIn)

    if (!showSidebar) {
        return <div className="min-h-screen bg-background">{children}</div>
    }

    // In your AppSidebar.tsx, add a class to the main layout div
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-full bg-background"> {/* Add bg-background here */}
                <AppSidebar />
                <main className="flex-1 overflow-auto bg-background"> {/* And here */}
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}