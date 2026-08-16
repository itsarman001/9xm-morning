import { useState, useEffect, useCallback } from "react";

export function useKeyboardRemote(player, onTogglePlaylist) {
  const [isRemoteModeActive, setIsRemoteModeActive] = useState(true);
  const [lastActionToast, setLastActionToast] = useState(null);

  const showToast = useCallback((message) => {
    setLastActionToast(message);
    setTimeout(() => {
      setLastActionToast((prev) => (prev === message ? null : prev));
    }, 1800);
  }, []);

  const toggleRemoteMode = useCallback(() => {
    setIsRemoteModeActive((prev) => {
      const nextState = !prev;
      showToast(nextState ? "Remote Mode ON (WASD Active)" : "Remote Mode OFF");
      return nextState;
    });
  }, [showToast]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input or textarea
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

      // 'R' always toggles keyboard remote mode
      if (key === "r") {
        e.preventDefault();
        toggleRemoteMode();
        return;
      }

      if (!isRemoteModeActive) {
        return;
      }

      if (e.code === "Space" || key === " ") {
        e.preventDefault();
        player.togglePlay();
        showToast(player.isPlaying ? "Paused" : "Playing");
      } else if (key === "w" || e.key === "ArrowUp") {
        e.preventDefault();
        const newVol = Math.min(100, player.volume + 5);
        player.setVolume(newVol);
        showToast(`Volume ${newVol}%`);
      } else if (key === "s" || e.key === "ArrowDown") {
        e.preventDefault();
        const newVol = Math.max(0, player.volume - 5);
        player.setVolume(newVol);
        showToast(`Volume ${newVol}%`);
      } else if (key === "a" || e.key === "ArrowLeft") {
        e.preventDefault();
        player.previous();
        showToast("Previous Track");
      } else if (key === "d" || e.key === "ArrowRight") {
        e.preventDefault();
        player.next();
        showToast("Next Track");
      } else if (key === "m") {
        e.preventDefault();
        player.toggleMute();
        showToast(player.isMuted ? "Muted" : "Unmuted");
      } else if (key === "p" && onTogglePlaylist) {
        e.preventDefault();
        onTogglePlaylist();
        showToast("Toggled Playlist");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRemoteModeActive, player, onTogglePlaylist, toggleRemoteMode, showToast]);

  return {
    isRemoteModeActive,
    toggleRemoteMode,
    lastActionToast,
  };
}
