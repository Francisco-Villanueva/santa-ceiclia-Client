import { ReactNode } from "react";
import { SearchInput, SideBar } from "@/components";
import { ThemeModeToggle } from "@/components/theme";
import { Toaster } from "@/components/ui/toaster";
import { QueueList, Reproductor, SoundPlayer } from "@/components/soundPlayer";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { UserMenu } from "@/components/auth/UserMenu";
import { getCurrentUser } from "@/lib/auth/guard";
import { getFirstPlayableSong } from "@/lib/data/songs";

export default async function HomeLayout({ children }: { children: ReactNode }) {
  // Independientes entre sí: se piden en paralelo.
  const [user, fallbackSong] = await Promise.all([getCurrentUser(), getFirstPlayableSong()]);

  return (
    <SessionProvider user={user}>
      <main className="h-dvh w-full bg-background text-foreground overflow-hidden select-none">
        <div className="flex flex-col justify-between h-full relative">
          <div className="flex h-[85%] max-h-[85%] min-h-[85%] max-w-full w-full relative">
            <SideBar />
            <div className="w-[87%] flex-grow border-l h-full max-lg:w-full pl-4">
              <div className="flex flex-col h-full">
                <header className="h-[10%]">
                  <div className="h-full p-4 flex items-center justify-between">
                    <SearchInput />
                    <div className="flex items-center gap-2">
                      <QueueList />
                      <ThemeModeToggle />
                      <UserMenu />
                    </div>
                  </div>
                </header>
                <div className="h-[90%] overflow-auto p-4">{children}</div>
              </div>
            </div>
          </div>
          <Reproductor fallbackSong={fallbackSong} />
        </div>
        <SoundPlayer />
        <Toaster />
      </main>
    </SessionProvider>
  );
}
