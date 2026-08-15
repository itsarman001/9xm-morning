# Agent Rules — 9XM Morning

Rules for any coding agent (Claude Code, Cursor, Copilot, etc.) working in this repo. Read this before writing code. When in doubt, do the smaller, simpler thing.

**Repo:** https://github.com/itsarman001/Remote-Kiske-Paas

## Prime Directive
This is a small, single-page ambient web app. It is not a platform. Every decision should be evaluated against: *"Does this help ship a nostalgic remote-control music page, or am I building infrastructure nobody asked for?"* If it's the latter, don't.

## Scope Discipline
- Build only what's in `plan.md` (P0 first, P1 after). Do not add features, pages, settings panels, or config options that weren't asked for.
- No user accounts, no backend, no database, no CMS. This is a static site with one env var (`VITE_PLAYLIST_SOURCE`).
- Don't introduce a state management library (Redux, Zustand, etc.) — React hooks + Context (if truly needed) are sufficient for this app's size.
- Don't add a component library / design system dependency. Tailwind + hand-built components only, per `Design.md`.
- If a "nice improvement" occurs to you mid-task that isn't in the plan, mention it as a suggestion in your response — don't silently build it.

## Keep It Small
- Prefer fewer files and fewer abstractions over "proper" layering. Don't create a folder structure deeper than `src/components/`, `src/hooks/`, `src/lib/` as laid out in `architecture.md`.
- Don't wrap simple things in unnecessary abstraction (no factory functions, no generic "manager" classes, no premature interfaces) for a codebase this size.
- One component = one responsibility, but don't split a component into five files if 40 lines in one file reads fine.
- No speculative/generic code for "future flexibility" (e.g. multi-playlist-source support, plugin systems, theming engines) unless explicitly requested.

## Dependencies
- Don't add a new npm package without a clear, specific reason tied to a real requirement.
- Stick to the agreed stack: React (Vite), Tailwind CSS, Howler.js. Anything beyond that needs a good reason, stated explicitly.
- No polyfills, no build-tool plugins "just in case."

## Code Style
- Functional components + hooks only. No class components.
- Keep hooks (`useAudioPlayer`, `useKeyboardRemote`) focused — one hook, one concern. Don't merge unrelated logic into a single mega-hook.
- Name things plainly and consistently with `architecture.md` (e.g. `useAudioPlayer`, not `usePlayerServiceProvider`).
- Comments explain *why*, not *what* — don't narrate obvious code line by line.
- No commented-out dead code left in commits.

## Respect the Hard Constraints
- **No TV/CRT screen element anywhere** — background is atmosphere only, remote is the sole interactive object. Don't reintroduce a "screen" mockup as a stylistic flourish.
- **No religious imagery, deity depictions, or religious symbols** in any asset, icon, prompt, or generated image — this applies to every commit, no exceptions, no "just a placeholder."
- **Chunked audio loading only** — never eager-fetch or pre-download the full playlist/queue. Stream current track (+ optional next-track prefetch) as described in `architecture.md`. If Howler's default behavior would fetch more aggressively than that, configure it explicitly rather than leaving default behavior unexamined.

## Before Adding Anything New
Ask, in order:
1. Is this in `plan.md` (P0/P1) or explicitly requested in this task?
2. Can this be done with what's already in the stack, without a new dependency or abstraction?
3. Is this the smallest version of the change that satisfies the requirement?

If any answer is "no," stop and either scope it down or flag it to Arman instead of building it.

## When Finishing a Task
- Remove any temporary/debug code, console.logs, and unused imports before considering a task done.
- Don't leave TODOs for things that were actually part of the current task — finish them or explicitly call them out as deferred, with a reason.
- Keep commits/diffs scoped to the task at hand — don't opportunistically refactor unrelated code in the same change.
