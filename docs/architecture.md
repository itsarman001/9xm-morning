# 9XM Morning — Architecture

## Stack Overview
- **React (Vite)** — component structure, state management via hooks (no external state lib needed at this scale)
- **Tailwind CSS** — styling, utility-first, keeps bundle lean
- **Howler.js** — audio playback engine (handles play/pause/seek/volume cleanly across browsers)
- **Vercel** — static deploy target, CI on push

## High-Level Structure

```
src/
  components/
    RemoteControl/       # the functional remote UI (icon-label-icon buttons)
    Playlist/             # playlist panel, track list
    BackgroundScene/       # sofa/room illustration, static
    TimeDate/              # P1 - date/time display
  hooks/
    useAudioPlayer.js     # wraps Howler.js instance + playback state
    useKeyboardRemote.js  # keybinding layer (R, WASD, Space)
  lib/
    playlistSource.js     # resolves playlist ID/link -> streamable track list
  App.jsx
```

## Playlist / Audio Source

The app holds an environment variable pointing to a **YouTube playlist ID or link**. This is the single source of truth for what music plays.

```
VITE_PLAYLIST_SOURCE=PLu1VwkFUm56jdkb3_AK9KHBOudjDQ3-J9
```

Source playlist for v1: https://youtube.com/playlist?list=PLu1VwkFUm56jdkb3_AK9KHBOudjDQ3-J9

At runtime, the app resolves this into a list of individual track sources rather than downloading/streaming the whole playlist file at once.

### Chunked Loading (critical constraint)
> "Make sure to not fetch entire file, fetch chunk by chunk — people don't like buffering."

- Do **not** eagerly fetch/decode the entire playlist's audio upfront.
- Load metadata for the playlist first (track list, titles, order) — lightweight.
- Fetch/stream **one track at a time**, on-demand:
  - Current track fully ready to play
  - Optionally pre-fetch the *next* track only, once current track playback starts, so skipping forward feels instant without over-fetching the whole queue.
- Howler.js supports HTML5 audio streaming mode (`html5: true`) which streams progressively rather than blocking on full download — use this rather than forcing a full buffer/decode upfront.

### Suggested flow
```
1. Read VITE_PLAYLIST_SOURCE
2. Resolve playlist -> ordered track metadata list (id, title, duration)
3. Render Playlist UI immediately from metadata
4. On play: instantiate Howler for current track only (streamed)
5. On playback start: prefetch next track's stream reference (not full buffer)
6. On Next/Previous: swap Howler instance to new track, stream fresh
```

## Remote Control Component

Reusable icon-label-icon pattern from notes:

```
[icon] [label] [icon]  --- ELB (external-link-button variant)
```

- `RemoteControl` renders Play/Pause, Next, Previous as this pattern
- Same component reused for P1's external link button (ELB variant)
- Central `useAudioPlayer` hook exposes: `isPlaying, currentTrack, play(), pause(), next(), previous(), setVolume()`
- Remote buttons and keyboard shortcuts both call into the same hook — single source of truth for playback control, no duplicated logic

## Keyboard Remote Mode

```
useKeyboardRemote(playerControls):
  R      -> toggle remote-mode on/off (visual affordance change, e.g. highlight remote)
  W/↑    -> volume up
  S/↓    -> volume down
  A/←    -> previous
  D/→    -> next
  Space  -> play/pause
```

- Should be toggle-gated by `R` so keys don't hijack typing/focus elsewhere on the page (if any inputs exist later, e.g. search)
- Attach/detach the `keydown` listener based on remote-mode state to avoid leaks

## Rendering / Assets

- `BackgroundScene` is a **static illustration only** — cozy household, girl on sofa. No TV/CRT element, no screen mockup.
- No religious imagery, deity depictions, or religious symbols in any illustrated asset (background, remote skin, icons) — hard constraint across the whole visual pipeline.
- Remote sits as a layered UI element on top of/beside the background scene, functional and clickable.

## Deployment
- Vercel, static build via `vite build`
- Environment variable (`VITE_PLAYLIST_SOURCE`) set in Vercel project settings, not committed to repo
