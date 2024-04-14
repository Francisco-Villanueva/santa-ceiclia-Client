import { SearchInput, SideBar } from "@/components";
import { ThemeModeToggle } from "@/components/theme";
import { Toaster } from "@/components/ui/toaster";
import React, { ReactNode } from "react";
import Provider from "./Provider";
import { QueueList, Reproductor } from "@/components/soundPlayer";
import PageLayout from "@/common/PageLayout";
interface RootLayoutProps {
  children: ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Provider>
      <main className="h-[100vh] w-full min-h-screen bg-background text-foreground overflow-hidden    ">
        <div className="flex flex-col justify-between h-full">
          <div className="flex h-[85%] max-w-full w-full   relative  ">
            <SideBar />
            <PageLayout>
              <div className="flex flex-col h-full  ">
                <section className="  h-[10%]  ">
                  <div className="  h-full p-4 flex items-center justify-between ">
                    <SearchInput />
                    <div className="flex items-center gap-2">
                      <QueueList />
                      <ThemeModeToggle />
                    </div>
                  </div>
                </section>
                <div className="h-[90%]  overflow-auto p-4">{children}</div>
              </div>
            </PageLayout>
          </div>
          <Reproductor />
        </div>
        <Toaster />
      </main>
    </Provider>
  );
}
