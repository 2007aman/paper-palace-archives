import { Palette } from "lucide-react";
import { THEMES, useTheme } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const [theme, setTheme] = useTheme();
  const current = THEMES.find((t) => t.id === theme)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1.5 text-sm hover:border-ring transition">
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">{current.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Choose your space</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onSelect={() => setTheme(t.id)}
            className={theme === t.id ? "bg-accent/30" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{t.name}</span>
              <span className="text-xs text-muted-foreground">{t.tag}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
