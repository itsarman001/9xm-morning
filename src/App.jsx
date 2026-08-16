import { useState } from "react";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useKeyboardRemote } from "./hooks/useKeyboardRemote";
import { Header } from "./components/header/Header";
import { BackgroundScene } from "./components/BackgroundScene/BackgroundScene";
import { RemoteControl } from "./components/RemoteControl/RemoteControl";
import { Playlist } from "./components/Playlist/Playlist";

export function App() {
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const player = useAudioPlayer();
  const { isRemoteModeActive, toggleRemoteMode, lastActionToast } =
    useKeyboardRemote(player, () => setIsPlaylistOpen((prev) => !prev));

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-950 text-white select-none">
      {/* Hidden YouTube Iframe for audio streaming */}
      <div
        id={player.containerId}
        className="absolute -top-96 -left-96 w-1 h-1 opacity-0 pointer-events-none"
      />

      {/* Background illustration & Central typography */}
      <BackgroundScene isRemoteActive={isRemoteModeActive} />

      {/* Top Bar (matching saloon.wtf reference screenshot layout) */}
      <Header />

      {/* Floating Interactive Remote Control Bar */}
      <RemoteControl
        player={player}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        isRemoteModeActive={isRemoteModeActive}
        onToggleRemoteMode={toggleRemoteMode}
      />

      {/* Playlist / TV Guide Modal */}
      <Playlist
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        tracks={player.tracks}
        currentIndex={player.currentIndex}
        isPlaying={player.isPlaying}
        onSelectTrack={player.selectTrack}
      />

      {/* Action Toast for Keyboard Remote feedback */}
      {lastActionToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500/90 text-zinc-950 font-mono text-xs font-bold shadow-xl backdrop-blur-md animate-bounce">
          {lastActionToast}
        </div>
      )}
    </div>
  );
}

export default App;
