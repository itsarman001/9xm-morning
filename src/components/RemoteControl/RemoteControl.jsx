import { useState, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Radio,
} from "lucide-react";

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function RemoteControl({
  player,
  onOpenPlaylist,
  isRemoteModeActive,
  onToggleRemoteMode,
}) {
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const progressBarRef = useRef(null);

  const {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
  } = player;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekClick = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    seek(newPercent * duration);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-8 inset-x-0 z-40 flex justify-center px-3 sm:px-6 pointer-events-auto">
      <div
        className={`w-full max-w-2xl sm:max-w-3xl rounded-3xl p-3 sm:p-4 transition-all duration-300 ${
          isRemoteModeActive
            ? "bg-zinc-900/80 border border-amber-500/40 shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(245,158,11,0.2)]"
            : "bg-zinc-900/60 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7)]"
        } backdrop-blur-2xl`}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-5">
          {/* Left: Spinning Disc Artwork */}
          <div
            onClick={onOpenPlaylist}
            title="Click to view playlist"
            className="relative group shrink-0 cursor-pointer"
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-amber-400/30 shadow-md relative flex items-center justify-center bg-zinc-800 ${
                isPlaying ? "animate-spin-slow" : "animate-spin-slow-paused"
              }`}
            >
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              {/* Vinyl center spindle hole */}
              <div className="absolute w-3 h-3 sm:w-3.5 sm:h-3.5 bg-zinc-900 rounded-full border border-amber-300/60 shadow-inner" />
            </div>

            {/* Quick hover badge */}
            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-amber-200">
              <ListMusic className="w-5 h-5 drop-shadow" />
            </div>
          </div>

          {/* Center: Track Metadata & Scrub Bar */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {/* Title & Artist */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-white truncate drop-shadow-sm">
                  {currentTrack.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-amber-200/70 truncate">
                  {currentTrack.artist}
                </p>
              </div>

              {/* Playlist Drawer trigger button */}
              <button
                onClick={onOpenPlaylist}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 hover:text-amber-300 transition-all cursor-pointer shrink-0"
              >
                <ListMusic className="w-3.5 h-3.5 text-amber-400" />
                <span>Playlist</span>
              </button>
            </div>

            {/* Scrubber Progress Bar */}
            <div className="flex items-center space-x-2.5">
              <div
                ref={progressBarRef}
                onClick={handleSeekClick}
                className="relative flex-1 h-2 sm:h-2.5 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer overflow-hidden transition-colors py-1 group"
              >
                {/* Progress fill */}
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full relative transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Timestamp */}
              <div className="font-mono text-[10px] sm:text-[11px] text-zinc-400 shrink-0 select-none">
                <span>{formatTime(currentTime)}</span>
                <span className="mx-1 text-zinc-600">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Right: Transport Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Previous */}
            <button
              onClick={previous}
              aria-label="Previous Track (A)"
              title="Previous Track (A / ←)"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <SkipBack className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
            </button>

            {/* Play / Pause Primary Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
              title="Play / Pause (Space)"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-zinc-950 hover:bg-amber-100 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current" />
              ) : (
                <Play className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={next}
              aria-label="Next Track (D)"
              title="Next Track (D / →)"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <SkipForward className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
            </button>

            {/* Volume Control / Slider */}
            <div className="relative">
              <button
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumePopup(true)}
                aria-label="Volume / Mute"
                title="Mute / Unmute (M)"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Volume Hover Slider */}
              {showVolumePopup && (
                <div
                  onMouseLeave={() => setShowVolumePopup(false)}
                  className="absolute bottom-full mb-3 -right-2 bg-zinc-900/95 border border-amber-500/30 p-2.5 rounded-xl shadow-2xl backdrop-blur-xl flex flex-col items-center z-50 w-8"
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="h-20 w-1.5 accent-amber-400 bg-zinc-700 rounded-lg appearance-none cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                  />
                  <span className="mt-1 text-[9px] font-mono text-amber-200">
                    {isMuted ? 0 : volume}%
                  </span>
                </div>
              )}
            </div>

            {/* Keyboard Remote Indicator Button */}
            <button
              onClick={onToggleRemoteMode}
              title="Toggle Keyboard Remote Control (R)"
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                isRemoteModeActive
                  ? "bg-amber-500/25 border border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                  : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              <Radio className="w-3 h-3 text-amber-400" />
              <span>[R] Remote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
