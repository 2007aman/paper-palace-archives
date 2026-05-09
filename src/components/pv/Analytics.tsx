import { useMemo } from "react";
import { PAPERS } from "@/data/papers";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function Analytics() {
  const bySubjectDownloads = useMemo(() => {
    const map: Record<string, number> = {};
    PAPERS.forEach((p) => { map[p.subject] = (map[p.subject] ?? 0) + p.downloads; });
    return Object.entries(map)
      .map(([name, downloads]) => ({ name, downloads }))
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 8);
  }, []);

  const difficulty = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    PAPERS.forEach((p) => {
      map[p.subject] ??= { Easy: 0, Medium: 0, Hard: 0 };
      map[p.subject][p.difficulty]++;
    });
    return Object.entries(map).slice(0, 6).map(([name, d]) => ({ name, ...d }));
  }, []);

  const repeated = [
    { q: "Explain ACID properties with examples.", count: 18 },
    { q: "Differentiate between paging and segmentation.", count: 15 },
    { q: "Construct a B+ tree of order 4 for given data.", count: 12 },
    { q: "Solve producer-consumer using semaphores.", count: 11 },
    { q: "Design a DFA for strings ending with '01'.", count: 9 },
  ];

  return (
    <section id="analytics" className="space-y-4">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Insights</p>
        <h2 className="text-3xl">What students are studying.</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="pv-card p-5">
          <p className="text-sm font-medium mb-3">Most downloaded subjects</p>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={bySubjectDownloads} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid stroke="var(--border)" horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" width={70} stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="downloads" fill="var(--accent)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pv-card p-5">
          <p className="text-sm font-medium mb-3">Difficulty distribution</p>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={difficulty}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="Easy" stackId="a" fill="var(--primary)" />
                <Bar dataKey="Medium" stackId="a" fill="var(--accent)" />
                <Bar dataKey="Hard" stackId="a" fill="var(--highlight)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="pv-card p-5">
        <p className="text-sm font-medium mb-3">Most repeated questions across years</p>
        <ul className="space-y-2">
          {repeated.map((r) => (
            <li key={r.q} className="flex items-center gap-4">
              <span className="flex-1 text-sm">{r.q}</span>
              <div className="hidden sm:block w-40 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(r.count / 18) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-16 text-right">{r.count}× years</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
