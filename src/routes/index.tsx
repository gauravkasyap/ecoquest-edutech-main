import { createFileRoute, Link } from "@tanstack/react-router";
import { EcoLayout } from "@/components/EcoLayout";
import { VirtualForest } from "@/components/VirtualForest";
import { usePlayer, BADGES, MISSIONS } from "@/lib/ecoquest-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoQuest — Gamified Eco Learning for Kids" },
      {
        name: "description",
        content:
          "Learn, play, and save the planet. Complete eco-missions, earn points and badges, and grow your own virtual forest.",
      },
      { property: "og:title", content: "EcoQuest — Gamified Eco Learning" },
      {
        property: "og:description",
        content: "Eco-missions, quizzes, badges, and a virtual forest that grows as you learn.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const player = usePlayer();
  const nextBadge = BADGES.find((b) => player.points < b.requirement);
  const nextMission = MISSIONS.find((m) => !player.completedMissions.includes(m.id));
  const progress = nextBadge
    ? Math.min(100, Math.round((player.points / nextBadge.requirement) * 100))
    : 100;

  return (
    <EcoLayout>
      <section className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="eco-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  Welcome back
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold">Hey {player.name}! 🌟</h1>
                <p className="text-sm text-muted-foreground">{player.school}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-bold text-primary">{player.points}</div>
                <div className="text-xs text-muted-foreground font-semibold">Eco Points</div>
              </div>
            </div>

            {nextBadge && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold">
                    Next badge: {nextBadge.emoji} {nextBadge.name}
                  </span>
                  <span className="text-muted-foreground">
                    {player.points} / {nextBadge.requirement}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <VirtualForest trees={player.treesPlanted} points={player.points} />

          <div className="grid sm:grid-cols-3 gap-3">
            <Stat label="Missions done" value={player.completedMissions.length} emoji="🎯" />
            <Stat label="Trees planted" value={player.treesPlanted} emoji="🌳" />
            <Stat label="Quizzes aced" value={player.completedQuizzes.length} emoji="🧠" />
          </div>
        </div>

        <aside className="space-y-5">
          {nextMission && (
            <div className="eco-card p-5">
              <p className="chip mb-2">Today's mission</p>
              <div className="text-5xl mb-2">{nextMission.emoji}</div>
              <h3 className="font-bold text-lg">{nextMission.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{nextMission.description}</p>
              <Link
                to="/missions"
                className="inline-flex items-center justify-center w-full rounded-full bg-primary text-primary-foreground font-bold py-2.5 hover:opacity-90"
              >
                Start mission · +{nextMission.points} pts
              </Link>
            </div>
          )}

          <div className="eco-card p-5">
            <h3 className="font-bold mb-2">Quick links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <QuickLink to="/quizzes" emoji="🧠" label="Take a quiz" />
              <QuickLink to="/badges" emoji="🎖️" label="My badges" />
              <QuickLink to="/leaderboard" emoji="🏆" label="Leaderboard" />
              <QuickLink to="/profile" emoji="👤" label="Profile" />
            </div>
          </div>
        </aside>
      </section>
    </EcoLayout>
  );
}

function Stat({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div className="eco-card p-4 flex items-center gap-3">
      <div className="text-3xl">{emoji}</div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground font-semibold">{label}</div>
      </div>
    </div>
  );
}

function QuickLink({ to, emoji, label }: { to: string; emoji: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 font-semibold hover:bg-primary hover:text-primary-foreground transition"
    >
      <span>{emoji}</span> {label}
    </Link>
  );
}
