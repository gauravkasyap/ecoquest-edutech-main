import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EcoLayout } from "@/components/EcoLayout";
import { LEADERBOARD, usePlayer } from "@/lib/ecoquest-store";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — EcoQuest" },
      { name: "description", content: "See how your eco efforts compare across schools." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const player = usePlayer();
  const [mode, setMode] = useState<"students" | "schools">("students");

  const entries = useMemo(() => {
    const all = [
      ...LEADERBOARD,
      {
        id: "me",
        name: player.name,
        school: player.school,
        points: player.points,
        avatar: "🌟",
        isMe: true,
      },
    ];
    return all.sort((a, b) => b.points - a.points);
  }, [player]);

  const schools = useMemo(() => {
    const tally = new Map<string, number>();
    for (const e of entries) tally.set(e.school, (tally.get(e.school) ?? 0) + e.points);
    return [...tally.entries()]
      .map(([school, points]) => ({ school, points }))
      .sort((a, b) => b.points - a.points);
  }, [entries]);

  return (
    <EcoLayout>
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Leaderboard 🏆</h1>
          <p className="text-sm text-muted-foreground">Friendly green competition.</p>
        </div>
        <div className="inline-flex p-1 rounded-full bg-muted">
          {(["students", "schools"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === "students" ? (
        <div className="eco-card divide-y divide-border">
          {entries.map((e, i) => (
            <div
              key={e.id}
              className={`flex items-center gap-4 p-4 ${e.isMe ? "bg-primary/10" : ""}`}
            >
              <div className="w-8 text-center font-bold text-lg">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </div>
              <div className="text-3xl">{e.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">
                  {e.name} {e.isMe && <span className="chip ml-1">You</span>}
                </div>
                <div className="text-xs text-muted-foreground truncate">{e.school}</div>
              </div>
              <div className="font-bold text-primary">{e.points}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="eco-card divide-y divide-border">
          {schools.map((s, i) => (
            <div key={s.school} className="flex items-center gap-4 p-4">
              <div className="w-8 text-center font-bold text-lg">{i === 0 ? "🏆" : i + 1}</div>
              <div className="text-3xl">🏫</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{s.school}</div>
                <div className="text-xs text-muted-foreground">Combined Eco Points</div>
              </div>
              <div className="font-bold text-primary">{s.points}</div>
            </div>
          ))}
        </div>
      )}
    </EcoLayout>
  );
}
