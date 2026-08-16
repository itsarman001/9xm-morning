import { useState, useRef, useEffect } from "react";
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
  const volumeRefDesktop = useRef(null);
  const volumeRefMobile = useRef(null);

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

  // Handle seeking accurately across mouse and touch
  const handleSeek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX =
      e.clientX ??
      (e.touches && e.touches[0] ? e.touches[0].clientX : null) ??
      (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : null);
    if (clientX === null || clientX === undefined) return;
    const clickX = clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    seek(newPercent * duration);
  };

  // Close volume popup when clicking/tapping outside
  useEffect(() => {
    if (!showVolumePopup) return;
    const handleClickOutside = (e) => {
      const isInsideDesktop = volumeRefDesktop.current?.contains(e.target);
      const isInsideMobile = volumeRefMobile.current?.contains(e.target);
      if (!isInsideDesktop && !isInsideMobile) {
        setShowVolumePopup(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [showVolumePopup]);

  return (
    <div className="fixed bottom-3 sm:bottom-6 md:bottom-8 inset-x-0 z-40 flex justify-center px-2.5 sm:px-4 md:px-6 pointer-events-auto">
      <div
        className={`w-full max-w-md sm:max-w-2xl md:max-w-3xl rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 md:p-4 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] sm:pb-3.5 md:pb-4 transition-all duration-300 ${
          isRemoteModeActive
            ? "bg-zinc-900/90 border border-amber-500/40 shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(245,158,11,0.2)]"
            : "bg-zinc-900/75 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7)]"
        } backdrop-blur-2xl`}
      >
        {/* DESKTOP & TABLET VIEWPORT (sm:flex) */}
        <div className="hidden sm:flex items-center justify-between gap-3 md:gap-5">
          {/* Left: Spinning Vinyl Disc Artwork */}
          <div
            onClick={onOpenPlaylist}
            title="Click to view playlist"
            className="relative group shrink-0 cursor-pointer"
          >
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-amber-400/30 shadow-md relative flex items-center justify-center bg-zinc-800 ${
                isPlaying ? "animate-spin-slow" : "animate-spin-slow-paused"
              }`}
            >
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute w-3 h-3 md:w-3.5 md:h-3.5 bg-zinc-900 rounded-full border border-amber-300/60 shadow-inner" />
            </div>

            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-amber-200">
              <ListMusic className="w-5 h-5 drop-shadow" />
            </div>
          </div>

          {/* Center: Track Metadata & Scrub Bar */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {/* Title & Artist & Playlist Drawer Trigger */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-white truncate drop-shadow-sm">
                  {currentTrack.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-amber-200/70 truncate">
                  {currentTrack.artist}
                </p>
              </div>

              <button
                onClick={onOpenPlaylist}
                aria-label="View Playlist (P)"
                title="View Playlist (P)"
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 hover:text-amber-300 transition-all cursor-pointer shrink-0"
              >
                <ListMusic className="w-3.5 h-3.5 text-amber-400" />
                <span>Playlist</span>
              </button>
            </div>

            {/* Scrubber Progress Bar */}
            <div className="flex items-center space-x-2.5">
              <div
                onClick={handleSeek}
                className="relative flex-1 h-2 sm:h-2.5 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer overflow-hidden transition-colors py-1 group"
              >
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full relative transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="font-mono text-[10px] sm:text-[11px] text-zinc-400 shrink-0 select-none">
                <span>{formatTime(currentTime)}</span>
                <span className="mx-1 text-zinc-600">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Right: Transport Controls */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 shrink-0">
            {/* Previous */}
            <button
              onClick={previous}
              aria-label="Previous Track (A)"
              title="Previous Track (A / ←)"
              className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <SkipBack className="w-4 h-4 md:w-4.5 md:h-4.5 fill-current" />
            </button>

            {/* Play / Pause Primary Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
              title="Play / Pause (Space)"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-zinc-950 hover:bg-amber-100 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 md:w-5.5 md:h-5.5 fill-current" />
              ) : (
                <Play className="w-5 h-5 md:w-5.5 md:h-5.5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={next}
              aria-label="Next Track (D)"
              title="Next Track (D / →)"
              className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <SkipForward className="w-4 h-4 md:w-4.5 md:h-4.5 fill-current" />
            </button>

            {/* Volume Control / Slider */}
            <div ref={volumeRefDesktop} className="relative">
              <button
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumePopup(true)}
                aria-label="Volume / Mute"
                title="Mute / Unmute (M)"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>

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
                  <button
                    onClick={toggleMute}
                    className="mt-1 text-[9px] font-mono text-amber-200 hover:underline cursor-pointer"
                  >
                    {isMuted ? "0%" : `${volume}%`}
                  </button>
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

        {/* MOBILE VIEWPORT (< sm:hidden) */}
        <div className="flex sm:hidden flex-col gap-2.5">
          {/* Row 1: Disc Artwork + Title/Artist + Playlist & Remote Badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {/* Disc Artwork */}
              <div
                onClick={onOpenPlaylist}
                title="Click to view playlist"
                className="relative group shrink-0 cursor-pointer"
              >
                <div
                  className={`w-10 h-10 xs:w-11 xs:h-11 rounded-full overflow-hidden border-2 border-amber-400/30 shadow-md relative flex items-center justify-center bg-zinc-800 ${
                    isPlaying ? "animate-spin-slow" : "animate-spin-slow-paused"
                  }`}
                >
                  <img
                    src={currentTrack.cover}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute w-2.5 h-2.5 bg-zinc-900 rounded-full border border-amber-300/60 shadow-inner" />
                </div>
              </div>

              {/* Title & Artist */}
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-white truncate drop-shadow-sm">
                  {currentTrack.title}
                </h3>
                <p className="text-[11px] text-amber-200/70 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Top-Right: Quick Action Badges */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onOpenPlaylist}
                aria-label="View Playlist"
                title="View Playlist (P)"
                className="flex items-center space-x-1 px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-[10px] xs:text-[11px] font-mono text-zinc-300 hover:text-amber-300 transition-all cursor-pointer"
              >
                <ListMusic className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">Playlist</span>
              </button>

              <button
                onClick={onToggleRemoteMode}
                aria-label="Toggle Keyboard Remote Control"
                title="Toggle Keyboard Remote Control (R)"
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  isRemoteModeActive
                    ? "bg-amber-500/25 border border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                    : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <Radio className="w-3 h-3 text-amber-400" />
                <span>[R]</span>
              </button>
            </div>
          </div>

          {/* Row 2: Full-Width Scrubber & Timestamps */}
          <div className="flex items-center space-x-2">
            <div className="font-mono text-[10px] text-zinc-400 shrink-0 select-none w-7 text-right">
              {formatTime(currentTime)}
            </div>

            <div
              onClick={handleSeek}
              onTouchStart={handleSeek}
              className="relative flex-1 h-2 bg-white/10 active:bg-white/20 rounded-full cursor-pointer overflow-hidden transition-colors py-1 group"
            >
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full relative transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="font-mono text-[10px] text-zinc-400 shrink-0 select-none w-7">
              {formatTime(duration)}
            </div>
          </div>

          {/* Row 3: Centered Tactile Transport Controls */}
          <div className="flex items-center justify-center space-x-6 pt-0.5">
            {/* Previous */}
            <button
              onClick={previous}
              aria-label="Previous Track"
              className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white active:bg-white/15 active:scale-95 transition-all cursor-pointer"
            >
              <SkipBack className="w-4.5 h-4.5 fill-current" />
            </button>

            {/* Play / Pause Primary Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-11 h-11 rounded-full bg-white text-zinc-950 hover:bg-amber-100 active:scale-95 shadow-lg flex items-center justify-center transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={next}
              aria-label="Next Track"
              className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white active:bg-white/15 active:scale-95 transition-all cursor-pointer"
            >
              <SkipForward className="w-4.5 h-4.5 fill-current" />
            </button>

            {/* Volume */}
            <div ref={volumeRefMobile} className="relative">
              <button
                onClick={() => setShowVolumePopup((prev) => !prev)}
                aria-label="Volume / Mute"
                className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white active:bg-white/15 transition-all cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4.5 h-4.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-4.5 h-4.5" />
                )}
              </button>

              {showVolumePopup && (
                <div className="absolute bottom-full mb-3 -right-2 bg-zinc-900/95 border border-amber-500/30 p-2.5 rounded-xl shadow-2xl backdrop-blur-xl flex flex-col items-center z-50 w-8">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="h-20 w-1.5 accent-amber-400 bg-zinc-700 rounded-lg appearance-none cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                  />
                  <button
                    onClick={toggleMute}
                    className="mt-1 text-[9px] font-mono text-amber-200 hover:underline cursor-pointer"
                  >
                    {isMuted ? "0%" : `${volume}%`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
