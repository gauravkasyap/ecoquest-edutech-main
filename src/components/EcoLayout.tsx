import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { usePlayer } from "@/lib/ecoquest-store";
import ecoquestLogo from "@/assets/ecoquest-logo.png";

const navItems = [
  { to: "/", label: "Home", emoji: "🏡" },
  { to: "/missions", label: "Missions", emoji: "🎯" },
  { to: "/quizzes", label: "Quizzes", emoji: "🧠" },
  { to: "/badges", label: "Badges", emoji: "🎖️" },
  { to: "/leaderboard", label: "Leaders", emoji: "🏆" },
] as const;

export function EcoLayout({ children }: { children: ReactNode }) {
  const player = usePlayer();
  return (
    <div className="min-h-screen pb-28 sm:pb-10">
      <header className="sticky top-0 z-30 backdrop-blur bg-background/70 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group" aria-label="EcoQuest home">
            <img src={ecoquestLogo} alt="EcoQuest logo" className="h-12 sm:h-14 w-auto tree-sway" />
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="px-3 py-1.5 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition"
                activeProps={{
                  className:
                    "px-3 py-1.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground",
                }}
              >
                <span className="mr-1">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground font-bold text-sm">
            <span>⭐</span>
            <span>{player.points}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-background/90 backdrop-blur border-t border-border">
        <div className="grid grid-cols-5">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold text-muted-foreground"
              activeProps={{
                className:
                  "flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold text-primary",
              }}
            >
              <span className="text-xl">{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
