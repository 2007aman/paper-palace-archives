import { useMemo, useRef, useState } from "react";
import { Search, History, TrendingUp, X } from "lucide-react";
import { PAPERS, TRENDING, type Paper } from "@/data/papers";
import { fuzzyScore, useStudy } from "@/lib/store";

export function SearchBar({
  value,
  onChange,
  onPick,
}: {
  value: string;
  onChange: (v: string) => void;
  onPick: (p: Paper) => void;
}) {
  const { stats, recordSearch } = useStudy();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!value.trim()) return [];
    return PAPERS
      .map((p) => ({
        p,
        score:
          fuzzyScore(value, p.title) * 1.2 +
          fuzzyScore(value, p.subject) +
          fuzzyScore(value, p.code) * 0.8,
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.p);
  }, [value]);

  const commit = (q: string) => {
    onChange(q);
    if (q) recordSearch(q);
  };

  return (
    <div ref={ref} className="relative w-full max-w-2xl">
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card/80 backdrop-blur px-4 py-3 shadow-sm focus-within:border-ring transition">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { commit(value); setOpen(false); }
          }}
          placeholder="Search DBMS, CS302, machine learning…"
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          aria-label="Search question papers"
        />
        {value && (
          <button onClick={() => onChange("")} aria-label="Clear">
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
        <kbd className="hidden md:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">/</kbd>
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-border bg-popover/95 backdrop-blur shadow-xl pv-fade-up overflow-hidden">
          {value.trim() && suggestions.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">Suggestions</p>
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onMouseDown={() => { commit(p.title); onPick(p); setOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent/20 flex items-center justify-between gap-3"
                >
                  <span className="truncate">
                    <span className="font-medium">{p.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{p.code} · {p.year}</span>
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">{p.branch}</span>
                </button>
              ))}
            </div>
          )}

          {!value.trim() && (
            <div className="grid sm:grid-cols-2 gap-1 p-2">
              <div className="p-2">
                <p className="px-2 py-1 text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <History className="h-3 w-3" /> Recent
                </p>
                {stats.searches.length === 0 && <p className="px-2 py-1 text-sm text-muted-foreground">No searches yet</p>}
                {stats.searches.map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => { commit(s); setOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-accent/20 text-sm"
                  >{s}</button>
                ))}
              </div>
              <div className="p-2">
                <p className="px-2 py-1 text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3" /> Trending
                </p>
                {TRENDING.map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => { commit(s); setOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-accent/20 text-sm"
                  >{s}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
