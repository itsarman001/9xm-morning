import { useEffect, useRef } from "react";
import { X, ListMusic, Music, Keyboard } from "lucide-react";

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function Playlist({
  isOpen,
  onClose,
  tracks,
  currentIndex,
  isPlaying,
  onSelectTrack,
}) {
  const panelRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Playlist Drawer Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full sm:max-w-md md:max-w-lg bg-zinc-900/90 border border-amber-500/20 sm:rounded-2xl rounded-t-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[70vh]"
        style={{
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245,158,11,0.12)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-950/40">
          <div className="flex items-center space-x-2.5">
            <ListMusic className="w-4 h-4 text-amber-400" />
            <span className="font-display font-bold text-sm tracking-wider uppercase text-amber-300">
              Playlist
            </span>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
              {tracks.length} Songs
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Playlist"
            className="w-7 h-7 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Track List */}
        <div className="overflow-y-auto p-2 sm:p-3 space-y-1 custom-scrollbar">
          {tracks.map((track, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={track.id || idx}
                onClick={() => {
                  onSelectTrack(idx);
                }}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
                  isSelected
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-200"
                    : "hover:bg-zinc-800/60 text-zinc-300 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 pr-3">
                  {/* Track Number / Equalizer */}
                  <div className="w-6 text-center font-mono text-xs text-zinc-400 shrink-0">
                    {isSelected && isPlaying ? (
                      <div className="flex items-end justify-center space-x-0.5 h-3.5">
                        <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
                        <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s] h-2" />
                        <span className="w-1 bg-amber-400 rounded-full animate-bounce h-3.5" />
                      </div>
                    ) : (
                      <span>{(idx + 1).toString().padStart(2, "0")}</span>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-10 h-10 rounded-lg object-cover bg-zinc-800 shrink-0 border border-zinc-700/50"
                  />

                  {/* Track details */}
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isSelected
                          ? "text-amber-300"
                          : "text-zinc-200 group-hover:text-white"
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <span className="font-mono text-xs text-zinc-400 shrink-0">
                  {formatTime(track.duration)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer tip */}
        <div className="px-5 py-2.5 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center space-x-1.5">
            <Music className="w-3.5 h-3.5 text-zinc-500" />
            <span>Press [P] to toggle playlist</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Keyboard className="w-3.5 h-3.5 text-zinc-500" />
            <span>[WASD] to control remote</span>
          </div>
        </div>
      </div>
    </div>
  );
}
