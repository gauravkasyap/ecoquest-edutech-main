import { createFileRoute } from "@tanstack/react-router";
import { EcoLayout } from "@/components/EcoLayout";
import { BADGES, usePlayer } from "@/lib/ecoquest-store";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Badges — EcoQuest" },
      { name: "description", content: "Collect badges as you grow into a planet hero." },
    ],
  }),
  component: BadgesPage,
});

function BadgesPage() {
  const player = usePlayer();
  return (
    <EcoLayout>
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold">Badges 🎖️</h1>
        <p className="text-sm text-muted-foreground">Earn Eco Points to unlock new badges.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGES.map((b) => {
          const unlocked = player.points >= b.requirement;
          const pct = Math.min(100, Math.round((player.points / b.requirement) * 100));
          return (
            <div
              key={b.id}
              className={`eco-card p-5 text-center ${unlocked ? "ring-2 ring-primary" : ""}`}
            >
              <div className={`text-6xl mb-2 ${unlocked ? "pop-in" : "grayscale opacity-40"}`}>
                {b.emoji}
              </div>
              <h3 className="font-bold text-lg">{b.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{b.description}</p>
              {unlocked ? (
                <span className="chip">✓ Unlocked</span>
              ) : (
                <div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden mb-1">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold">
                    {player.points} / {b.requirement}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </EcoLayout>
  );
}
