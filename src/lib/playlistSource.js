export const DEFAULT_PLAYLIST_ID = "PLu1VwkFUm56jdkb3_AK9KHBOudjDQ3-J9";

export const PLAYLIST_SOURCE =
  import.meta.env.VITE_PLAYLIST_SOURCE || DEFAULT_PLAYLIST_ID;

export const YOUTUBE_PLAYLIST_URL = `https://youtube.com/playlist?list=${PLAYLIST_SOURCE}`;
export const YOUTUBE_MUSIC_PLAYLIST_URL = `https://music.youtube.com/playlist?list=${PLAYLIST_SOURCE}`;
export const GITHUB_REPO_URL =
  "https://github.com/itsarman001/Remote-Kiske-Paas";
export const SPOTIFY_URL = "https://open.spotify.com";

// Curated nostalgic 9XM era morning tracks for instant display & metadata
export const FALLBACK_TRACKS = [
  {
    id: "track-1",
    title: "Mujhse Mohabbat Ka Izhaar Karta",
    artist: "9XM Morning Special",
    album: "9XM Nostalgia Vol. 1",
    duration: 304,
    cover:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "track-2",
    title: "Main Agar Kahoon",
    artist: "Sonu Nigam & Shreya Ghoshal",
    album: "Om Shanti Om",
    duration: 310,
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "track-3",
    title: "Tum Se Hi",
    artist: "Mohit Chauhan",
    album: "Jab We Met",
    duration: 323,
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "track-4",
    title: "Pehli Nazar Mein",
    artist: "Atif Aslam",
    album: "Race",
    duration: 314,
    cover:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "track-5",
    title: "Kya Mujhe Pyar Hai",
    artist: "KK",
    album: "Woh Lamhe",
    duration: 275,
    cover:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "track-6",
    title: "Zara Sa",
    artist: "KK & Pritam",
    album: "Jannat",
    duration: 303,
    cover:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "track-7",
    title: "Tera Hone Laga Hoon",
    artist: "Atif Aslam & Alisha Chinai",
    album: "Ajab Prem Ki Ghazab Kahani",
    duration: 299,
    cover:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "track-8",
    title: "Tu Jaane Na",
    artist: "Atif Aslam",
    album: "Ajab Prem Ki Ghazab Kahani",
    duration: 341,
    cover:
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "track-9",
    title: "Soniyo",
    artist: "Sonu Nigam & Shreya Ghoshal",
    album: "Raaz 2",
    duration: 330,
    cover:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "track-10",
    title: "Emosanal Attyachaar",
    artist: "Brass Band Version",
    album: "Dev D",
    duration: 236,
    cover:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&auto=format&fit=crop&q=80",
  },
];
