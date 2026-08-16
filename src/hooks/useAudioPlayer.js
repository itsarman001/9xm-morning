import { useState, useEffect, useRef, useCallback } from "react";
import { PLAYLIST_SOURCE, FALLBACK_TRACKS } from "../lib/playlistSource";

const YT_CONTAINER_ID = "yt-audio-player-mount";

let isApiLoading = false;
let apiLoadedPromise = null;

function loadYouTubeIframeApi() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (apiLoadedPromise) {
    return apiLoadedPromise;
  }

  apiLoadedPromise = new Promise((resolve) => {
    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (existingCallback) existingCallback();
      resolve(window.YT);
    };

    if (!isApiLoading) {
      isApiLoading = true;
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  });

  return apiLoadedPromise;
}

export function useAudioPlayer() {
  const playerRef = useRef(null);
  
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_TRACKS[0].duration);
  const [volume, setVolumeState] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [tracks, setTracks] = useState(FALLBACK_TRACKS);
  const [currentTrack, setCurrentTrack] = useState(FALLBACK_TRACKS[0]);

  const updateTrackInfo = useCallback(() => {
    if (!playerRef.current || typeof playerRef.current.getVideoData !== "function") return;
    
    try {
      const data = playerRef.current.getVideoData();
      const idx = playerRef.current.getPlaylistIndex?.() ?? 0;
      const dur = playerRef.current.getDuration?.() ?? 0;
      
      if (dur > 0) {
        setDuration(dur);
      }
      
      if (typeof idx === "number" && idx >= 0) {
        setCurrentIndex(idx);
      }

      if (data && data.title) {
        const fallback = FALLBACK_TRACKS[idx % FALLBACK_TRACKS.length];
        setCurrentTrack({
          id: data.video_id || `yt-${idx}`,
          title: data.title || fallback.title,
          artist: data.author || fallback.artist,
          album: fallback.album || "9XM Morning",
          duration: dur > 0 ? dur : fallback.duration,
          cover: data.video_id 
            ? `https://img.youtube.com/vi/${data.video_id}/mqdefault.jpg`
            : fallback.cover,
        });
      }
    } catch {
      // Ignored if player is destroyed or still initializing
    }
  }, []);

  // Initialize YouTube player
  useEffect(() => {
    let isCancelled = false;

    loadYouTubeIframeApi().then((YT) => {
      if (isCancelled) return;

      new YT.Player(YT_CONTAINER_ID, {
        height: "1",
        width: "1",
        playerVars: {
          listType: "playlist",
          list: PLAYLIST_SOURCE,
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (isCancelled) return;
            playerRef.current = event.target;
            event.target.setVolume(80);
            setIsReady(true);
            
            const pList = event.target.getPlaylist?.();
            if (Array.isArray(pList) && pList.length > 0) {
              const mapped = pList.map((vid, i) => {
                const fb = FALLBACK_TRACKS[i % FALLBACK_TRACKS.length];
                return {
                  id: vid,
                  title: fb ? fb.title : `Track ${i + 1}`,
                  artist: fb ? fb.artist : "9XM Morning",
                  album: fb ? fb.album : "Nostalgic Morning",
                  duration: fb ? fb.duration : 240,
                  cover: `https://img.youtube.com/vi/${vid}/mqdefault.jpg`,
                };
              });
              setTracks(mapped);
            }
            updateTrackInfo();
          },
          onStateChange: (event) => {
            if (isCancelled) return;
            // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
            if (event.data === 1) {
              setIsPlaying(true);
              updateTrackInfo();
            } else if (event.data === 2 || event.data === 0 || event.data === 5) {
              setIsPlaying(false);
            }
          },
          onError: () => {
            if (playerRef.current?.nextVideo) {
              playerRef.current.nextVideo();
            }
          },
        },
      });
    });

    return () => {
      isCancelled = true;
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignored
        }
      }
    };
  }, [updateTrackInfo]);

  // Polling playback progress
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        try {
          const curr = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (typeof curr === "number" && !isNaN(curr)) {
            setCurrentTime(curr);
          }
          if (typeof dur === "number" && dur > 0 && !isNaN(dur)) {
            setDuration(dur);
          }
        } catch {
          // Ignored
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const play = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === "function") {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.nextVideo === "function") {
      playerRef.current.nextVideo();
      setTimeout(updateTrackInfo, 600);
    } else {
      const nextIdx = (currentIndex + 1) % tracks.length;
      setCurrentIndex(nextIdx);
      setCurrentTrack(tracks[nextIdx]);
    }
  }, [currentIndex, tracks, updateTrackInfo]);

  const previous = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.previousVideo === "function") {
      playerRef.current.previousVideo();
      setTimeout(updateTrackInfo, 600);
    } else {
      const prevIdx = (currentIndex - 1 + tracks.length) % tracks.length;
      setCurrentIndex(prevIdx);
      setCurrentTrack(tracks[prevIdx]);
    }
  }, [currentIndex, tracks, updateTrackInfo]);

  const selectTrack = useCallback((index) => {
    if (playerRef.current && typeof playerRef.current.playVideoAt === "function") {
      playerRef.current.playVideoAt(index);
      setCurrentIndex(index);
      setTimeout(updateTrackInfo, 600);
    } else if (tracks[index]) {
      setCurrentIndex(index);
      setCurrentTrack(tracks[index]);
    }
  }, [tracks, updateTrackInfo]);

  const seek = useCallback((seconds) => {
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(seconds, true);
      setCurrentTime(seconds);
    }
  }, []);

  const setVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(100, val));
    setVolumeState(clamped);
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(clamped);
      if (clamped === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
        playerRef.current.unMute();
      }
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
      if (volume === 0) setVolumeState(80);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  return {
    containerId: YT_CONTAINER_ID,
    isReady,
    isPlaying,
    currentIndex,
    currentTime,
    duration,
    volume,
    isMuted,
    tracks,
    currentTrack,
    play,
    pause,
    togglePlay,
    next,
    previous,
    selectTrack,
    seek,
    setVolume,
    toggleMute,
  };
}
