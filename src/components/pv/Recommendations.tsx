import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { PAPERS, type Paper } from "@/data/papers";
import { useStudy } from "@/lib/store";

export function Recommendations({ onOpen }: { onOpen: (p: Paper) => void }) {
  const { stats } = useStudy();

  const recs = useMemo(() => {
    const recent = stats.viewed.map((id) => PAPERS.find((p) => p.id === id)).filter(Boolean) as Paper[];
    const seedSubjects = new Set(recent.map((p) => p.subject));
    const seedBranches = new Set(recent.map((p) => p.branch));

    if (recent.length === 0) {
      // popular fallback
      return [...PAPERS].sort((a, b) => b.downloads - a.downloads).slice(0, 4);
    }

    const scored = PAPERS
      .filter((p) => !stats.viewed.includes(p.id))
      .map((p) => {
        let s = 0;
        if (seedSubjects.has(p.subject)) s += 5;
        if (seedBranches.has(p.branch)) s += 3;
        s += p.downloads / 1500;
        if (recent[0] && p.semester === recent[0].semester) s += 2;
        return { p, s };
      })
      .sort((a, b) => b.s - a.s)
      .slice(0, 4)
      .map((x) => x.p);
    return scored;
  }, [stats.viewed]);

  const seed = stats.viewed[0] ? PAPERS.find((p) => p.id === stats.viewed[0])?.subject : null;

  return (
    <section className="pv-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-accent" />
        <p className="text-sm font-medium">Recommended for you</p>
        {seed && <span className="text-xs text-muted-foreground">— students who viewed {seed} also liked</span>}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {recs.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpen(p)}
            className="text-left p-3 rounded-lg border border-border hover:border-ring transition"
          >
            <p className="text-[11px] font-mono text-muted-foreground">{p.code} · {p.year}</p>
            <p className="text-sm font-medium mt-0.5">{p.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{p.branch} · {p.type}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
