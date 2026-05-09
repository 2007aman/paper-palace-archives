import { Bookmark, Download, Eye, FileText, WifiOff } from "lucide-react";
import type { Paper } from "@/data/papers";
import { useStudy } from "@/lib/store";
import { motion } from "framer-motion";

export function PaperCard({ paper, onOpen, index = 0 }: { paper: Paper; onOpen: (p: Paper) => void; index?: number }) {
  const { stats, toggleBookmark, toggleOffline, download } = useStudy();
  const bookmarked = stats.bookmarks.includes(paper.id);
  const offline = stats.offline.includes(paper.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.4), duration: 0.35 }}
      className="pv-card relative p-5 flex flex-col gap-3"
    >
      <span className="pv-pin absolute -top-1.5 left-5 hidden [data-theme='noticeboard']_&:block" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-mono text-muted-foreground">{paper.code} · {paper.branch} · Sem {paper.semester}</p>
          <h3 className="font-semibold leading-snug mt-1">{paper.title}</h3>
        </div>
        <button
          onClick={() => toggleBookmark(paper.id)}
          aria-label="Bookmark"
          className={"p-1.5 rounded-md transition " + (bookmarked ? "text-accent" : "text-muted-foreground hover:text-foreground")}
        >
          <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <Tag>{paper.year}</Tag>
        <Tag>{paper.type}</Tag>
        <Tag intent={paper.difficulty === "Hard" ? "warn" : paper.difficulty === "Medium" ? "info" : "ok"}>
          {paper.difficulty}
        </Tag>
        {offline && (
          <Tag intent="ok"><WifiOff className="h-3 w-3" /> Offline</Tag>
        )}
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">
        Faculty: {paper.faculty} · {paper.pages} pages · {paper.downloads.toLocaleString()} downloads
      </p>

      <div className="mt-auto flex items-center gap-2 pt-2">
        <button
          onClick={() => onOpen(paper)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm rounded-md bg-primary text-primary-foreground py-1.5 hover:opacity-90 transition"
        >
          <Eye className="h-3.5 w-3.5" /> Preview
        </button>
        <button
          onClick={() => download(paper.id)}
          aria-label="Download"
          className="p-2 rounded-md border border-border hover:border-ring transition"
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          onClick={() => toggleOffline(paper.id)}
          aria-label="Save offline"
          className={
            "p-2 rounded-md border transition " +
            (offline ? "border-accent text-accent" : "border-border hover:border-ring")
          }
        >
          <FileText className="h-4 w-4" />
        </button>
      </div>
    </motion.article>
  );
}

function Tag({ children, intent }: { children: React.ReactNode; intent?: "ok" | "warn" | "info" }) {
  const map: Record<string, string> = {
    ok: "bg-[oklch(0.85_0.13_140_/_0.25)] text-[oklch(0.35_0.15_140)]",
    warn: "bg-[oklch(0.85_0.18_30_/_0.25)] text-[oklch(0.4_0.18_30)]",
    info: "bg-[oklch(0.85_0.13_240_/_0.25)] text-[oklch(0.35_0.15_240)]",
  };
  return (
    <span
      className={
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono " +
        (intent ? map[intent] : "bg-secondary text-secondary-foreground")
      }
    >
      {children}
    </span>
  );
}
