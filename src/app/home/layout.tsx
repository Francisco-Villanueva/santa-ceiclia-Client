import { SearchInput, SideBar } from "@/components";
import { ThemeModeToggle } from "@/components/theme";
import { Toaster } from "@/components/ui/toaster";
import React, { ReactNode } from "react";
import Provider from "./Provider";
import { Reproductor } from "@/components/soundPlayer";
interface RootLayoutProps {
  children: ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Provider>
      <main className="h-[100vh] w-full min-h-screen bg-background text-foreground overflow-hidden    ">
        <div className="flex h-full max-w-full w-full gap- max-h-full">
          <SideBar />
          <div className="w-[87%] flex-grow border h-full max-lg:w-full pl-4 ">
            <div className="flex flex-col h-full  ">
              <section className="  h-[10%] ">
                <div className="  h-full p-4 flex items-center justify-between ">
                  <SearchInput />
                  <ThemeModeToggle />
                </div>
              </section>
              <div className="h-[90%] overflow-auto p-4">{children}</div>
            </div>
          </div>
        </div>

        <Toaster />
        <Reproductor />
      </main>
    </Provider>
  );
}
