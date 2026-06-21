import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EcoLayout } from "@/components/EcoLayout";
import { usePlayer, updateProfile, resetProgress } from "@/lib/ecoquest-store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — EcoQuest" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const player = usePlayer();
  const [name, setName] = useState(player.name);
  const [school, setSchool] = useState(player.school);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name.trim() || "Eco Explorer", school.trim() || "My School");
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <EcoLayout>
      <h1 className="text-2xl sm:text-3xl font-bold mb-5">Your Profile 👤</h1>
      <form onSubmit={save} className="eco-card p-6 space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-bold mb-1">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-input bg-card px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Your school</label>
          <input
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full rounded-xl border border-input bg-card px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-primary text-primary-foreground font-bold px-6 py-2.5"
          >
            Save
          </button>
          {saved && <span className="text-sm text-primary font-semibold">Saved! ✓</span>}
        </div>
      </form>

      <div className="eco-card p-6 mt-5 max-w-lg">
        <h3 className="font-bold mb-2">Reset progress</h3>
        <p className="text-sm text-muted-foreground mb-3">
          This will clear your points, missions, badges, and trees. You can start fresh.
        </p>
        <button
          onClick={() => {
            if (confirm("Reset all progress?")) resetProgress();
          }}
          className="rounded-full bg-destructive text-destructive-foreground font-bold px-5 py-2 text-sm"
        >
          Reset everything
        </button>
      </div>
    </EcoLayout>
  );
}
