import { SearchInput, SideBar } from "@/components";
import { ThemeModeToggle } from "@/components/theme";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import React, { ReactNode } from "react";
interface RootLayoutProps {
  children: ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <main className="h-[100vh] w-full min-h-screen bg-background text-foreground    ">
      <ResizablePanelGroup direction="horizontal" className=" h-full  ">
        <ResizablePanel maxSize={12}>
          <SideBar />
        </ResizablePanel>
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel maxSize={10}>
              <div className="  h-full px-6 flex items-center justify-between ">
                <SearchInput />
                <ThemeModeToggle />
              </div>
            </ResizablePanel>
            <ResizablePanel>
              <div className="">{children}</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
