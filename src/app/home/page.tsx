import { HomeLandingPage } from "@/components";
import { getPublicPlaylists } from "@/lib/data/catalog";
import { getSongs } from "@/lib/data/songs";

export default async function HomePage() {
  const [songs, playlists] = await Promise.all([getSongs(), getPublicPlaylists()]);
  return <HomeLandingPage songs={songs} playlists={playlists} />;
}
