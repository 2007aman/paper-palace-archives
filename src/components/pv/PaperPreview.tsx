import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Paper } from "@/data/papers";
import { useStudy } from "@/lib/store";
import { Bookmark, CheckCircle2, Maximize2, Minus, Plus, StickyNote, Timer, WifiOff } from "lucide-react";

export function PaperPreview({ paper, onClose }: { paper: Paper | null; onClose: () => void }) {
  const open = !!paper;
  const { stats, view, toggleBookmark, toggleOffline, markSolved, setNote } = useStudy();
  const [zoom, setZoom] = useState(1);
  const [focus, setFocus] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState<number[]>([]);
  const [note, setLocalNote] = useState("");

  useEffect(() => {
    if (paper) {
      view(paper.id);
      setZoom(1);
      setFocus(false);
      setHighlightIdx([]);
      setLocalNote(stats.notes[paper.id] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paper?.id]);

  if (!paper) return null;
  const bookmarked = stats.bookmarks.includes(paper.id);
  const offline = stats.offline.includes(paper.id);
  const solved = stats.solved.includes(paper.id);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className={
          "max-w-5xl p-0 overflow-hidden " +
          (focus ? "bg-[oklch(0.14_0.03_260)] text-[oklch(0.95_0.01_90)]" : "")
        }
      >
        <DialogHeader className="px-6 py-4 border-b border-border flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <p className="text-[11px] font-mono text-muted-foreground">{paper.code} · {paper.branch} · Sem {paper.semester} · {paper.year}</p>
            <DialogTitle className="text-lg font-display mt-1">{paper.title}</DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">{paper.type} · {paper.faculty} · {paper.pages} pages</p>
          </div>
          <div className="flex items-center gap-1">
            <IconBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}><Minus className="h-4 w-4" /></IconBtn>
            <span className="text-xs font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
            <IconBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}><Plus className="h-4 w-4" /></IconBtn>
            <IconBtn label="Focus" active={focus} onClick={() => setFocus((f) => !f)}><Maximize2 className="h-4 w-4" /></IconBtn>
            <IconBtn label="Bookmark" active={bookmarked} onClick={() => toggleBookmark(paper.id)}>
              <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
            </IconBtn>
            <IconBtn label="Offline" active={offline} onClick={() => toggleOffline(paper.id)}><WifiOff className="h-4 w-4" /></IconBtn>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-[1fr_280px] gap-0 max-h-[70vh]">
          <div className="overflow-auto p-8" style={{ background: focus ? undefined : "var(--surface)" }}>
            <div
              className="mx-auto bg-[oklch(0.99_0.005_85)] text-[oklch(0.18_0.02_60)] shadow-2xl rounded-sm border border-[oklch(0.85_0.02_60)] origin-top"
              style={{ maxWidth: 720, transform: `scale(${zoom})` }}
            >
              <div className="border-b border-[oklch(0.85_0.02_60)] p-6 text-center">
                <p className="font-mono text-[11px] tracking-widest uppercase text-[oklch(0.4_0.04_60)]">PaperVault Archive</p>
                <h4 className="font-display text-2xl mt-1">{paper.title}</h4>
                <p className="text-xs mt-1">{paper.code} · {paper.type} Examination · {paper.year}</p>
                <div className="flex justify-between text-[11px] font-mono mt-3 text-[oklch(0.4_0.04_60)]">
                  <span>Time: 3 hours</span><span>Max marks: 100</span>
                </div>
              </div>
              <ol className="p-8 space-y-3 list-decimal list-inside text-sm leading-relaxed">
                {paper.questions.map((q, i) => (
                  <li
                    key={i}
                    onClick={() =>
                      setHighlightIdx((h) => (h.includes(i) ? h.filter((x) => x !== i) : [...h, i]))
                    }
                    className={
                      "cursor-pointer rounded px-2 py-1 transition " +
                      (highlightIdx.includes(i)
                        ? "bg-[oklch(0.92_0.18_95)] text-[oklch(0.2_0.04_60)]"
                        : "hover:bg-[oklch(0.95_0.04_85)]")
                    }
                  >
                    {q} <span className="text-[oklch(0.5_0.04_60)] text-xs">[10 marks]</span>
                  </li>
                ))}
              </ol>
              <div className="text-center text-[11px] font-mono text-[oklch(0.5_0.04_60)] py-4 border-t border-[oklch(0.85_0.02_60)]">
                — End of paper —
              </div>
            </div>
          </div>

          {!focus && (
            <aside className="border-l border-border p-4 overflow-auto bg-card/50">
              <p className="text-[11px] uppercase font-mono tracking-wider text-muted-foreground flex items-center gap-1.5"><StickyNote className="h-3 w-3" /> Your note</p>
              <textarea
                value={note}
                onChange={(e) => { setLocalNote(e.target.value); setNote(paper.id, e.target.value); }}
                placeholder="Mark difficult questions, jot down formulas…"
                className="mt-2 w-full h-32 rounded-md bg-background border border-border p-2 text-sm outline-none focus:border-ring"
              />
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => markSolved(paper.id)}
                  className={
                    "inline-flex items-center justify-center gap-2 rounded-md py-2 text-sm transition " +
                    (solved
                      ? "bg-[oklch(0.85_0.13_140_/_0.25)] text-[oklch(0.35_0.15_140)]"
                      : "bg-primary text-primary-foreground hover:opacity-90")
                  }
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {solved ? "Solved · +25 XP earned" : "Mark as solved (+25 XP)"}
                </button>
                <a
                  href="#timer"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-md py-2 text-sm border border-border hover:border-ring"
                >
                  <Timer className="h-4 w-4" /> Start study timer
                </a>
              </div>
              <div className="mt-5 text-xs text-muted-foreground space-y-1">
                <p>Tip: click any question to highlight it.</p>
                <p>Notes are saved locally on this device.</p>
              </div>
            </aside>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IconBtn({
  children, onClick, label, active,
}: { children: React.ReactNode; onClick: () => void; label: string; active?: boolean }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={
        "p-1.5 rounded-md border transition " +
        (active ? "border-accent text-accent" : "border-border text-muted-foreground hover:text-foreground hover:border-ring")
      }
    >
      {children}
    </button>
  );
}
