# 9XM Morning 📺

> _"9XM Morning"_ — A nostalgic single-page ambient music experience bringing back the 9XM morning era of Indian households.

Inspired by [saloon.wtf](https://saloon.wtf), this app drops you into a cozy old Indian living room — a girl on the sofa, warm morning light — with a **functional remote control** as the only interactive element. No screens, no dashboards. Just music and atmosphere.

**Live:** [https://9xm-morning.vercel.app/](https://9xm-morning.vercel.app/) · **Source playlist:** [YouTube](https://youtube.com/playlist?list=PLu1VwkFUm56jdkb3_AK9KHBOudjDQ3-J9)

---

## Features

- 🎵 **Ambient music playback** — streamed from a YouTube playlist, chunk-by-chunk (no buffering stalls)
- 📻 **Remote control UI** — play/pause, next/previous, volume, scrub bar — all in a tactile remote-style widget
- 📋 **Playlist drawer** — view and jump to any track
- ⌨️ **Keyboard Remote Mode** — press `R` to activate, then use `WASD` / arrow keys + `Space` to control playback without touching the mouse

### Keyboard shortcuts (when Remote Mode is active)

| Key       | Action                        |
| --------- | ----------------------------- |
| `R`       | Toggle keyboard remote on/off |
| `Space`   | Play / Pause                  |
| `A` / `←` | Previous track                |
| `D` / `→` | Next track                    |
| `W` / `↑` | Volume up                     |
| `S` / `↓` | Volume down                   |
| `P`       | Open / close playlist         |

---

## Tech Stack

| Layer      | Tech                                |
| ---------- | ----------------------------------- |
| Framework  | React 19 + Vite                     |
| Styling    | Tailwind CSS v4                     |
| Audio      | Howler.js (`html5: true` streaming) |
| Icons      | Lucide React                        |
| Deployment | Vercel                              |

---

## Getting Started

```bash
# Install dependencies
pnpm install   # or npm install

# Add your env variable
cp .env.example .env
# Set VITE_PLAYLIST_SOURCE to your YouTube playlist ID

# Start dev server
pnpm dev
```

### Environment Variables

| Variable               | Description                              |
| ---------------------- | ---------------------------------------- |
| `VITE_PLAYLIST_SOURCE` | YouTube playlist ID to stream music from |

> The playlist ID is **not committed to the repo**. Set it in your `.env` file locally and in Vercel project settings for production.

---

## Project Structure

```
src/
  components/
    RemoteControl/      # Floating player bar — controls + scrubber
    Playlist/           # Slide-in playlist drawer
    BackgroundScene/    # Static ambient background illustration
    TimeDate/           # (P1) Date/time display
  hooks/
    useAudioPlayer.js   # Howler.js wrapper + all playback state
    useKeyboardRemote.js # Keyboard remote mode (R, WASD, Space)
  lib/
    playlistSource.js   # Resolves playlist ID → track metadata list
  App.jsx
```

---

## Contributing

This is a small, intentionally scoped app. Before adding anything, check [`docs/plan.md`](docs/plan.md) and [`AGENTS.md`](AGENTS.md) — the scope is deliberately narrow. Open an issue first if you want to discuss a feature.
