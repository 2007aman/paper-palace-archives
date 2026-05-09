import { useEffect, useState } from "react";

const SYMBOLS = ["π", "∑", "∫", "λ", "Δ", "θ", "ƒ", "≈", "Ω", "∞"];

export function Background() {
  const [symbols] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      ch: SYMBOLS[i % SYMBOLS.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 32 + Math.random() * 80,
      delay: Math.random() * 6,
      dur: 8 + Math.random() * 8,
    })),
  );

  // Time-based hue tilt
  useEffect(() => {
    const apply = () => {
      const h = new Date().getHours();
      const tone = h < 6 || h > 19 ? "night" : h < 11 ? "morning" : h < 17 ? "day" : "evening";
      document.documentElement.dataset.tod = tone;
    };
    apply();
    const i = setInterval(apply, 60_000);
    return () => clearInterval(i);
  }, []);

  return (
    <>
      <div className="pv-bg" />
      <div className="pv-bg-grid" />
      <div className="fixed inset-0 -z-[1] pointer-events-none overflow-hidden">
        {symbols.map((s, i) => (
          <span
            key={i}
            className="pv-float-symbol"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              fontSize: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
              color: "var(--foreground)",
            }}
          >
            {s.ch}
          </span>
        ))}
      </div>
    </>
  );
}
