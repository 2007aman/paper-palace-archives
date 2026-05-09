import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Timer as TimerIcon } from "lucide-react";

const PRESETS = [15, 25, 45, 60];

export function StudyTimer() {
  const [target, setTarget] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { setRunning(false); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(i);
  }, [running]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const pct = target ? (1 - remaining / target) * 100 : 0;

  return (
    <section id="timer" className="pv-card p-6 flex flex-col md:flex-row items-center gap-6">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="var(--muted)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="44" fill="none"
            stroke="var(--primary)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 276.46} 276.46`}
            style={{ transition: "stroke-dasharray .5s linear" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center font-display text-3xl tabular-nums">{mm}:{ss}</div>
      </div>

      <div className="flex-1 w-full">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <TimerIcon className="h-3 w-3" /> Focus session
        </p>
        <h3 className="text-2xl mt-1">Deep work, no distractions.</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Pick a length. Solve a paper. Earn XP for finishing.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => { setTarget(m * 60); setRemaining(m * 60); setRunning(false); }}
              className={
                "px-3 py-1.5 rounded-full text-xs border transition " +
                (target === m * 60
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-ring")
              }
            >
              {m} min
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setRunning((r) => !r)}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm hover:opacity-90"
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => { setRemaining(target); setRunning(false); }}
              aria-label="Reset"
              className="p-2 rounded-md border border-border hover:border-ring"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
