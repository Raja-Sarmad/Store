"use client";

const FLAKES = Array.from({ length: 42 }, (_, i) => {
  const left = ((i * 37) % 100) + (i % 7) * 0.3;
  const size = 3 + (i % 5);
  const duration = 11 + (i % 9);
  const delay = (i % 12) * -0.85;
  const opacity = 0.28 + (i % 5) * 0.08;
  const drift = (i % 2 === 0 ? 1 : -1) * (12 + (i % 18));
  return { left, size, duration, delay, opacity, drift };
});

export default function WinterSnow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[45] overflow-hidden" aria-hidden>
      {FLAKES.map((flake, index) => (
        <span
          key={index}
          className="sp-snowflake absolute top-[-12px] rounded-full bg-white"
          style={{
            left: `${flake.left}%`,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            ["--sp-drift" as string]: `${flake.drift}px`,
            boxShadow: "0 0 6px rgba(255,255,255,0.55)",
          }}
        />
      ))}
    </div>
  );
}
