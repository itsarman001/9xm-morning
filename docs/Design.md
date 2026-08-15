# 9XM Morning — Design

## Mood & Background
A cozy old Indian household, mornings — warm, nostalgic, lived-in. A girl sitting on a sofa. Ambient household calm rather than a "screen" or "app" feeling.

Reference inspiration: saloon.wtf — single ambient scene, minimal UI chrome, the illustration *is* the experience.

**No TV / CRT element.** Earlier notes considered a CRT with "9XM" written on it, but the scene is background-only — the remote is the sole interactive object layered on top. Keep the background as pure atmosphere: sofa, room, warm light, no screen-within-screen.

**Hard constraint:** No religious imagery, deity images, or religious symbols anywhere in the scene, remote skin, or icon set. This applies to every illustrated asset without exception.

## Core UI: The Remote
The remote is the entire interactive surface — it should feel like an object, not a media-player widget. Think tactile: rounded buttons, slight texture/shadow, retro-plastic feel rather than flat modern UI.

### Reusable control pattern
```
[icon]   Label   [icon]
  ---------------------
      (ELB variant)
```
- Icon–label–icon block, used consistently across controls
- "ELB" (external-link-button) is a variant of this same component — keeps visual language consistent between playback controls and the P1 external link button

### Remote Layout (from sketch)
```
┌─────────────────────────────┐
│ TIME / DATE      [ELB][ELB] │
│                              │
│  ┌────────────────────────┐ │
│  │ Playlist               │ │
│  │ 1. ───────────         │ │
│  │ 2. ───────────         │ │
│  │ 3. ───────────         │ │
│  │ 4. ───────────         │ │
│  └────────────────────────┘ │
│                              │
│  [<]   [▶]   [>]    [🔊]    │
└─────────────────────────────┘
```
- Top row: Time/Date (P1) + two ELB slots (external link buttons)
- Middle: playlist panel, scrollable list, numbered
- Bottom: transport controls — previous / play-pause / next / volume, laid out as a horizontal control strip

## Interaction States
- **Idle / paused** — remote sits quietly on the scene, subtle idle animation optional (e.g. gentle glow or breathing shadow) but nothing loud
- **Playing** — play button swaps to pause icon; optional subtle pulse on the active playlist row to show "now playing"
- **Keyboard remote mode (`R` toggled on)** — remote gets a visible highlight/glow to indicate keyboard control is live, so the user knows WASD/Space are active
- **Track change (Next/Previous)** — quick, snappy transition; avoid long fades that make skipping feel laggy, especially since audio is chunk-loaded

## Typography & Color
- Warm, slightly muted palette — think old household lighting: ambers, warm browns, faded pastels, not saturated/neon
- Typography should lean nostalgic/retro without tipping into pastiche — a rounded or slightly quirky display font for the "9XM Morning" title treatment is fine, body/UI text stays clean and legible
- Avoid glossy "modern SaaS" gradients or neon accents — the whole point is it should feel like an old object in a warm room, not a tech product

## Accessibility Notes
- Remote buttons need clear focus states for keyboard navigation (independent of the custom `R`-mode keybinding layer)
- Sufficient contrast between remote button icons/labels and the warm background — nostalgic tone shouldn't come at the cost of legibility
- Playlist list items should be clickable/tappable with adequate hit-area size, not just decorative text

## Asset Pipeline Note
Google Stitch was tried for UI generation but produced fragmented results. Current plan: export the closest Stitch result as a static reference image, then hand-implement the remote and scene directly in React/Tailwind rather than relying on generated code — keeps full control over the tactile "remote as object" feel and guarantees the no-religious-imagery constraint is respected exactly.
