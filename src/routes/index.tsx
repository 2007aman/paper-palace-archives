import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PAPERS, type Paper } from "@/data/papers";
import { fuzzyScore, useCursorBackground, useDebounced } from "@/lib/store";
import { Background } from "@/components/pv/Background";
import { ThemeSwitcher } from "@/components/pv/ThemeSwitcher";
import { SearchBar } from "@/components/pv/SearchBar";
import { Filters, EMPTY_FILTERS, type FilterState } from "@/components/pv/Filters";
import { PaperCard } from "@/components/pv/PaperCard";
import { PaperPreview } from "@/components/pv/PaperPreview";
import { Dashboard } from "@/components/pv/Dashboard";
import { StudyTimer } from "@/components/pv/StudyTimer";
import { Analytics } from "@/components/pv/Analytics";
import { Recommendations } from "@/components/pv/Recommendations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PaperVault — A digital library for question papers" },
      { name: "description", content: "Search, filter, preview and study past question papers across branches, semesters and years." },
    ],
  }),
  component: Index,
});

function Index() {
  useCursorBackground();
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query, 180);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [active, setActive] = useState<Paper | null>(null);
  const [visible, setVisible] = useState(12);

  // keyboard "/" focuses search
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.target as HTMLElement)?.tagName !== "INPUT" && (e.target as HTMLElement)?.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[aria-label="Search question papers"]')?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const results = useMemo(() => {
    const q = debounced.trim();
    let list = PAPERS.filter((p) => {
      if (filters.branch !== "all" && p.branch !== filters.branch) return false;
      if (filters.semester !== "all" && String(p.semester) !== filters.semester) return false;
      if (filters.year !== "all" && String(p.year) !== filters.year) return false;
      if (filters.faculty !== "all" && p.faculty !== filters.faculty) return false;
      if (filters.type !== "all" && p.type !== filters.type) return false;
      if (filters.difficulty !== "all" && p.difficulty !== filters.difficulty) return false;
      return true;
    });
    if (q) {
      list = list
        .map((p) => ({
          p,
          s: fuzzyScore(q, p.title) * 1.3 + fuzzyScore(q, p.subject) + fuzzyScore(q, p.code) * 0.9 + fuzzyScore(q, p.faculty) * 0.4,
        }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.p);
    } else {
      list = list.sort((a, b) => b.year - a.year || b.downloads - a.downloads);
    }
    return list;
  }, [debounced, filters]);

  return (
    <div className="min-h-screen relative">
      <Background />

      {/* Nav */}
      <header className="sticky top-0 z-20 backdrop-blur bg-background/70 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold">P</span>
            <span className="font-display text-xl tracking-tight">PaperVault</span>
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">1.0</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#library" className="hover:text-foreground transition">Library</a>
            <a href="#dashboard" className="hover:text-foreground transition">Dashboard</a>
            <a href="#timer" className="hover:text-foreground transition">Focus</a>
            <a href="#analytics" className="hover:text-foreground transition">Insights</a>
          </nav>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
              <Sparkles className="h-3 w-3 text-accent" /> A digital library, designed for students
            </p>
            <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
              Past papers,{" "}
              <span className="font-[var(--font-hand)] text-[1.15em] text-accent">beautifully</span>{" "}
              archived.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              Search across branches, semesters and years. Preview without downloading.
              Bookmark, annotate and study with focus — all stored locally on your device.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#library" className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
                <BookOpen className="h-4 w-4" /> Browse the library
              </a>
              <a href="#dashboard" className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm hover:border-ring transition">
                <GraduationCap className="h-4 w-4" /> Open my study room
              </a>
            </div>

            <div className="mt-10">
              <SearchBar value={query} onChange={setQuery} onPick={(p) => setActive(p)} />
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <li><b className="text-foreground">{PAPERS.length}+</b> question papers</li>
              <li><b className="text-foreground">6</b> branches</li>
              <li><b className="text-foreground">8</b> semesters</li>
              <li>5 hand-crafted themes</li>
              <li>100% local, no account needed</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Library */}
      <section id="library" className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 lg:sticky lg:top-20 lg:self-start pv-card p-5">
            <p className="font-display text-xl mb-4">Refine</p>
            <Filters value={filters} onChange={setFilters} />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Library</p>
                <h2 className="text-3xl">{results.length} papers</h2>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Showing {Math.min(visible, results.length)} of {results.length}
              </p>
            </div>

            {results.length === 0 ? (
              <div className="pv-card p-12 text-center">
                <p className="font-display text-2xl">No papers match.</p>
                <p className="text-sm text-muted-foreground mt-1">Try clearing filters or a different keyword.</p>
                <button onClick={() => { setFilters(EMPTY_FILTERS); setQuery(""); }} className="mt-4 text-sm underline underline-offset-4">Reset everything</button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.slice(0, visible).map((p, i) => (
                    <PaperCard key={p.id} paper={p} onOpen={(x) => setActive(x)} index={i} />
                  ))}
                </div>
                {visible < results.length && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setVisible((v) => v + 12)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2 text-sm hover:border-ring"
                    >
                      Load more <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <Recommendations onOpen={(p) => setActive(p)} />
      </section>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <Dashboard onOpen={(p) => setActive(p)} />
      </section>

      {/* Timer */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <StudyTimer />
      </section>

      {/* Analytics */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <Analytics />
      </section>

      <footer className="mx-auto max-w-7xl px-4 sm:px-6 py-12 border-t border-border mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            <span className="font-display text-foreground">PaperVault 1.0</span> — built for students who care about how studying feels.
          </p>
          <p className="font-[var(--font-hand)] text-lg text-foreground">Keep going. You're closer than yesterday.</p>
        </div>
      </footer>

      <PaperPreview paper={active} onClose={() => setActive(null)} />
    </div>
  );
}
