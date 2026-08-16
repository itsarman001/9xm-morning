import { TimeDate } from "../TimeDate/TimeDate";
import {
  YOUTUBE_MUSIC_PLAYLIST_URL,
  GITHUB_REPO_URL,
} from "../../lib/playlistSource";
import { ArrowUpRight } from "lucide-react";
import { SiYoutubemusic, SiGithub } from "@icons-pack/react-simple-icons";

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 pointer-events-auto">
      {/* Top-Left: Time / Date */}
      <div className="flex items-center space-x-3">
        <TimeDate />
      </div>

      {/* Top-Right: External Link Buttons (ELB) */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <a
          href={YOUTUBE_MUSIC_PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Open YouTube Playlist"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-500/40 text-xs font-medium text-zinc-200 hover:text-amber-300 backdrop-blur-md transition-all cursor-pointer shadow-sm group"
        >
          <SiYoutubemusic className="w-4 h-4 text-red-500 shrink-0" />

          <span className="sm:inline">YT Music</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </a>

        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Open GitHub Repo"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-500/40 text-xs font-medium text-zinc-200 hover:text-amber-300 backdrop-blur-md transition-all cursor-pointer shadow-sm group"
        >
          <SiGithub className="w-4 h-4 text-white shrink-0" />

          <span className="sm:inline">GitHub</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </a>
      </div>
    </header>
  );
}
