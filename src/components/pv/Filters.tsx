import { PAPERS } from "@/data/papers";
import { useMemo } from "react";

export type FilterState = {
  branch: string;
  semester: string;
  year: string;
  faculty: string;
  type: string;
  difficulty: string;
};

export const EMPTY_FILTERS: FilterState = {
  branch: "all", semester: "all", year: "all", faculty: "all", type: "all", difficulty: "all",
};

export function Filters({ value, onChange }: { value: FilterState; onChange: (v: FilterState) => void }) {
  const opts = useMemo(() => {
    const uniq = <K extends keyof typeof PAPERS[number]>(k: K) =>
      Array.from(new Set(PAPERS.map((p) => p[k]))).sort((a: any, b: any) => (a > b ? 1 : -1));
    return {
      branch: uniq("branch"),
      semester: uniq("semester"),
      year: uniq("year"),
      faculty: uniq("faculty"),
      type: uniq("type"),
      difficulty: ["Easy", "Medium", "Hard"],
    };
  }, []);

  const groups: Array<{ key: keyof FilterState; label: string; values: any[] }> = [
    { key: "branch", label: "Branch", values: opts.branch },
    { key: "semester", label: "Semester", values: opts.semester },
    { key: "year", label: "Year", values: opts.year },
    { key: "type", label: "Type", values: opts.type },
    { key: "difficulty", label: "Difficulty", values: opts.difficulty },
    { key: "faculty", label: "Faculty", values: opts.faculty },
  ];

  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.key}>
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">{g.label}</p>
          <div className="flex flex-wrap gap-1.5">
            <Pill active={value[g.key] === "all"} onClick={() => onChange({ ...value, [g.key]: "all" })}>All</Pill>
            {g.values.map((v) => (
              <Pill
                key={String(v)}
                active={value[g.key] === String(v)}
                onClick={() => onChange({ ...value, [g.key]: String(v) })}
              >
                {String(v)}
              </Pill>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange(EMPTY_FILTERS)}
        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
      >
        Reset filters
      </button>
    </div>
  );
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={
        "px-2.5 py-1 rounded-full text-xs border transition " +
        (active
          ? "bg-primary text-primary-foreground border-primary"
          : "border-border bg-card hover:border-ring")
      }
    >
      {children}
    </button>
  );
}
