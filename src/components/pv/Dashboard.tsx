import { useEffect, useMemo, useState } from "react";
import { Award, Bookmark, Flame, Sparkles, TrendingUp } from "lucide-react";
import { PAPERS, type Paper } from "@/data/papers";
import { useStudy } from "@/lib/store";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 700;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n}{suffix}</>;
}

export function Dashboard({ onOpen }: { onOpen: (p: Paper) => void }) {
  const { stats } = useStudy();

  const bySubject = useMemo(() => {
    const counts: Record<string, number> = {};
    stats.viewed.forEach((id) => {
      const p = PAPERS.find((x) => x.id === id);
      if (p) counts[p.subject] = (counts[p.subject] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [stats.viewed]);

  const weekly = stats.weeklySolved.map((v, i) => ({
    day: ["M", "T", "W", "T", "F", "S", "S"][i],
    solved: v,
  }));

  const recent = stats.viewed
    .map((id) => PAPERS.find((p) => p.id === id))
    .filter(Boolean) as Paper[];

  const COLORS = ["var(--primary)", "var(--accent)", "var(--highlight)", "var(--ring)", "var(--muted-foreground)"];

  const milestones = [
    { id: "first", label: "First paper", done: stats.solved.length >= 1, icon: Sparkles },
    { id: "five", label: "5 papers solved", done: stats.solved.length >= 5, icon: Award },
    { id: "streak3", label: "3-day streak", done: stats.streak >= 3, icon: Flame },
    { id: "bookmark", label: "First bookmark", done: stats.bookmarks.length >= 1, icon: Bookmark },
  ];

  return (
    <section id="dashboard" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Your study room</p>
          <h2 className="text-3xl">Welcome back, scholar.</h2>
        </div>
        <p className="hidden md:block text-sm text-muted-foreground italic font-[var(--font-hand)] text-lg">
          “Slow is smooth. Smooth is fast.”
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Solved this week" value={stats.weeklySolved.reduce((a, b) => a + b, 0)} accent />
        <Stat label="Subjects explored" value={bySubject.length} />
        <Stat label="Study streak" value={stats.streak} suffix=" days" icon={<Flame className="h-4 w-4" />} />
        <Stat label="XP earned" value={stats.xp} icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="pv-card p-5 lg:col-span-2">
          <p className="text-sm font-medium mb-1">Weekly solving rhythm</p>
          <p className="text-xs text-muted-foreground mb-4">Papers fully solved in the last 7 days</p>
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={weekly}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12,
                  }}
                />
                <Bar dataKey="solved" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pv-card p-5">
          <p className="text-sm font-medium mb-1">Where you spent time</p>
          <p className="text-xs text-muted-foreground mb-4">By subject (recently viewed)</p>
          {bySubject.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">Open a paper to start tracking.</p>
          ) : (
            <div className="h-48">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={bySubject} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={3}>
                    {bySubject.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="pv-card p-5 lg:col-span-2">
          <p className="text-sm font-medium mb-3">Recently viewed</p>
          {recent.length === 0 && <p className="text-sm text-muted-foreground">Your viewing history will appear here.</p>}
          <ul className="divide-y divide-border">
            {recent.slice(0, 5).map((p) => (
              <li key={p.id}>
                <button onClick={() => onOpen(p)} className="w-full py-2.5 flex items-center justify-between text-left hover:opacity-80">
                  <span>
                    <span className="text-sm font-medium">{p.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground font-mono">{p.code} · {p.year}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{p.type}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="pv-card p-5">
          <p className="text-sm font-medium mb-3">Milestones</p>
          <ul className="space-y-2.5">
            {milestones.map((m) => (
              <li key={m.id} className="flex items-center gap-3 text-sm">
                <span className={
                  "h-8 w-8 rounded-full grid place-items-center " +
                  (m.done ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")
                }>
                  <m.icon className="h-4 w-4" />
                </span>
                <span className={m.done ? "" : "text-muted-foreground"}>{m.label}</span>
                {m.done && <span className="ml-auto text-[10px] font-mono text-accent">DONE</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label, value, suffix, accent, icon,
}: { label: string; value: number; suffix?: string; accent?: boolean; icon?: React.ReactNode }) {
  return (
    <div className={"pv-card p-5 " + (accent ? "ring-1 ring-ring/30" : "")}>
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">{icon}{label}</p>
      <p className="mt-2 text-3xl font-display tabular-nums">
        <Counter value={value} suffix={suffix} />
      </p>
    </div>
  );
}
