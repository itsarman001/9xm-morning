export function BackgroundScene() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      {/* Background illustration */}
      <img
        src="/background.png"
        alt="Cozy Indian morning living room"
        className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-1000 ease-out filter brightness-[0.88] contrast-[1.05]"
      />

      {/* Atmospheric warm ambient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-black/25 to-zinc-950/40" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />

      {/* Centerpiece Hero Devanagari Typography (matching saloon.wtf reference style) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-6 sm:-translate-y-10 z-10 px-4 text-center">
        <p className="mt-2 mb-4 font-display text-xs sm:text-sm md:text-base tracking-[0.35em] text-amber-200/80 uppercase font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          9XM Morning Nostalgia
        </p>
      </div>
    </div>
  );
}
