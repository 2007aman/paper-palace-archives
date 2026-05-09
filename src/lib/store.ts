import { useEffect, useState, useCallback } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export type Theme = "noticeboard" | "midnight" | "archive" | "blueprint" | "cafe";

export const THEMES: Array<{ id: Theme; name: string; tag: string }> = [
  { id: "noticeboard", name: "Campus Noticeboard", tag: "Warm · Pinboard" },
  { id: "midnight", name: "Midnight Library", tag: "Calm · Focused" },
  { id: "archive", name: "Archive Room", tag: "Vintage · Editorial" },
  { id: "blueprint", name: "Engineering Blueprint", tag: "Technical · Grid" },
  { id: "cafe", name: "Study Café", tag: "Cozy · Productive" },
];

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("pv:theme", "noticeboard");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return [theme, setTheme] as const;
}

export function useDebounced<T>(value: T, delay = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function useCursorBackground() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--mx", `${x}%`);
      document.documentElement.style.setProperty("--my", `${y}%`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
}

/* ----- App-wide local data hooks ----- */

export type StudyStats = {
  solved: string[]; // paper ids
  viewed: string[]; // paper ids most recent first
  downloaded: string[];
  offline: string[];
  bookmarks: string[];
  searches: string[]; // most recent first
  notes: Record<string, string>;
  xp: number;
  streak: number;
  lastActive: string; // YYYY-MM-DD
  weeklySolved: number[]; // 7 days
};

const today = () => new Date().toISOString().slice(0, 10);

export function useStudy() {
  const [stats, setStats] = useLocalStorage<StudyStats>("pv:study", {
    solved: [],
    viewed: [],
    downloaded: [],
    offline: [],
    bookmarks: [],
    searches: [],
    notes: {},
    xp: 120,
    streak: 1,
    lastActive: today(),
    weeklySolved: [1, 2, 0, 3, 1, 4, 2],
  });

  // streak handling
  useEffect(() => {
    const t = today();
    if (stats.lastActive !== t) {
      const last = new Date(stats.lastActive);
      const now = new Date(t);
      const diff = Math.round((+now - +last) / 86400000);
      setStats((s) => ({
        ...s,
        lastActive: t,
        streak: diff === 1 ? s.streak + 1 : 1,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const view = useCallback(
    (id: string) =>
      setStats((s) => ({ ...s, viewed: [id, ...s.viewed.filter((x) => x !== id)].slice(0, 12) })),
    [setStats],
  );
  const download = useCallback(
    (id: string) =>
      setStats((s) => ({
        ...s,
        downloaded: [id, ...s.downloaded.filter((x) => x !== id)].slice(0, 30),
        xp: s.xp + 10,
      })),
    [setStats],
  );
  const toggleBookmark = useCallback(
    (id: string) =>
      setStats((s) => ({
        ...s,
        bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter((x) => x !== id) : [id, ...s.bookmarks],
      })),
    [setStats],
  );
  const toggleOffline = useCallback(
    (id: string) =>
      setStats((s) => ({
        ...s,
        offline: s.offline.includes(id) ? s.offline.filter((x) => x !== id) : [id, ...s.offline],
      })),
    [setStats],
  );
  const markSolved = useCallback(
    (id: string) =>
      setStats((s) => {
        if (s.solved.includes(id)) return s;
        const w = [...s.weeklySolved];
        w[w.length - 1] = (w[w.length - 1] || 0) + 1;
        return { ...s, solved: [id, ...s.solved], xp: s.xp + 25, weeklySolved: w };
      }),
    [setStats],
  );
  const setNote = useCallback(
    (id: string, text: string) => setStats((s) => ({ ...s, notes: { ...s.notes, [id]: text } })),
    [setStats],
  );
  const recordSearch = useCallback(
    (q: string) => {
      const t = q.trim();
      if (!t) return;
      setStats((s) => ({ ...s, searches: [t, ...s.searches.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 8) }));
    },
    [setStats],
  );

  return { stats, view, download, toggleBookmark, toggleOffline, markSolved, setNote, recordSearch };
}

/* fuzzy scoring */
export function fuzzyScore(query: string, target: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return 100 - (t.indexOf(q) * 0.5);
  let qi = 0, score = 0, streak = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) { qi++; streak++; score += 1 + streak; }
    else streak = 0;
  }
  return qi === q.length ? score : 0;
}
