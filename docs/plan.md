# 9XM Morning — Plan

## Concept
"Remote kaake paas hai" — a nostalgic single-page web experience that brings back the 9XM era of Indian mornings. Inspired by saloon.wtf's ambient nostalgia trend.

A cozy old Indian household scene (girl on a sofa, warm living-room backdrop) with a **functional remote control** as the interactive centerpiece. No TV/screen mockup — the remote itself is the UI. Music plays ambiently in the background while the remote controls it.

**Hard constraint:** No religious imagery, deity images, or religious symbols anywhere in the scene, remote, or any illustrated asset.

## Links
- **YouTube Playlist (source):** https://youtube.com/playlist?list=PLu1VwkFUm56jdkb3_AK9KHBOudjDQ3-J9
- **GitHub Repo:** https://github.com/itsarman001/Remote-Kiske-Paas

## Tech Stack
- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS
- **Audio:** Howler.js
- **Deployment:** Vercel

## Scope

### P0 — Must Have
- [ ] Play / Pause
- [ ] Next / Previous track
- [ ] Playlist (view + select from list)
- [ ] Background scene illustration (sofa, cozy household, no TV)
- [ ] Functional remote UI (icon–label–icon control component)
- [ ] Audio streaming from a YouTube playlist source (chunked, not full fetch)

### P1 — Nice to Have
- [ ] Date / Time display on remote or screen
- [ ] External link button (e.g. link to source playlist / about)

### Extra Feature — Keyboard "TV Remote" Mode
- `R` — toggle remote/keyboard-control mode
- `W A S D` → `↑ ← ↓ →`
- `↑` = volume up
- `↓` = volume down
- `→` = next track
- `←` = previous track
- `Space` = play / pause

## Explicit Non-Goals
- No TV / CRT screen illustration or mockup — remote + background only
- No religious imagery, deity depictions, or religious symbols in any asset
- No full-playlist eager fetching — chunked loading only, to avoid buffering stalls

## Milestones
1. **Static scene** — background illustration + static remote layout (no interactivity)
2. **Core playback** — Howler.js wired to Play/Pause/Next/Previous + playlist selection
3. **Keyboard remote mode** — full keybinding layer
4. **Polish** — Date/Time, external link, transitions, mobile responsiveness
5. **Deploy** — ship to Vercel

## Open Questions
- Final call on chunking strategy for YouTube-sourced audio (see architecture.md)
- Exact visual style/reference for the background scene (once Stitch/reference asset is finalized)
