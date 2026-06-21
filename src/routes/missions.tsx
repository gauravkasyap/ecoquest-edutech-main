import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { EcoLayout } from "@/components/EcoLayout";
import { MISSIONS, completeMission, usePlayer, type Mission } from "@/lib/ecoquest-store";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Missions — EcoQuest" },
      {
        name: "description",
        content: "Real-world eco-missions kids can do at home and at school.",
      },
    ],
  }),
  component: MissionsPage,
});

const categoryColors: Record<Mission["category"], string> = {
  water: "bg-secondary/15 text-secondary-foreground",
  waste: "bg-accent/30 text-accent-foreground",
  plants: "bg-primary/15 text-primary",
  energy: "bg-accent/20 text-accent-foreground",
  community: "bg-secondary/20 text-secondary-foreground",
};

function MissionsPage() {
  const player = usePlayer();
  const [filter, setFilter] = useState<Mission["category"] | "all">("all");
  const [toast, setToast] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<Mission | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = filter === "all" ? MISSIONS : MISSIONS.filter((m) => m.category === filter);

  const openVerify = (m: Mission) => {
    setVerifying(m);
    setPhoto(null);
  };

  const closeVerify = () => {
    setVerifying(null);
    setPhoto(null);
  };

  const onPhotoPicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const confirmComplete = () => {
    if (!verifying || !photo) return;
    completeMission(verifying);
    setToast(`+${verifying.points} Eco Points! 🎉`);
    closeVerify();
    setTimeout(() => setToast(null), 2000);
  };

  const categories: Array<Mission["category"] | "all"> = [
    "all",
    "plants",
    "water",
    "waste",
    "energy",
    "community",
  ];

  return (
    <EcoLayout>
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Eco Missions 🎯</h1>
          <p className="text-sm text-muted-foreground">
            Snap a photo to verify, then earn Eco Points.
          </p>
        </div>
        <div className="text-sm font-semibold">
          {player.completedMissions.length} / {MISSIONS.length} complete
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition ${
              filter === c
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((m) => {
          const done = player.completedMissions.includes(m.id);
          return (
            <div key={m.id} className={`eco-card p-5 flex flex-col ${done ? "opacity-70" : ""}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="text-4xl">{m.emoji}</div>
                <span className={`chip ${categoryColors[m.category]}`}>{m.category}</span>
              </div>
              <h3 className="font-bold text-lg">{m.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{m.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">+{m.points} pts</span>
                <button
                  disabled={done}
                  onClick={() => openVerify(m)}
                  className="rounded-full bg-primary text-primary-foreground font-bold px-4 py-2 text-sm disabled:bg-muted disabled:text-muted-foreground hover:opacity-90"
                >
                  {done ? "✓ Done" : "📸 Verify & complete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {verifying && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={closeVerify}
        >
          <div
            className="bg-background rounded-2xl shadow-xl max-w-md w-full p-5 pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl">{verifying.emoji}</div>
              <div>
                <h3 className="font-bold text-lg leading-tight">{verifying.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Click a photo as proof to earn +{verifying.points} pts
                </p>
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onPhotoPicked}
            />

            <div className="aspect-square w-full rounded-xl bg-muted overflow-hidden flex items-center justify-center mb-3 border-2 border-dashed border-border">
              {photo ? (
                <img src={photo} alt="Mission proof" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground p-6">
                  <div className="text-5xl mb-2">📷</div>
                  <p className="text-sm font-semibold">No photo yet</p>
                  <p className="text-xs">Tap below to open camera</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-full bg-secondary text-secondary-foreground font-bold py-2.5 hover:opacity-90"
              >
                {photo ? "🔄 Retake photo" : "📸 Take photo"}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={closeVerify}
                  className="flex-1 rounded-full bg-muted font-semibold py-2.5 hover:bg-muted/70"
                >
                  Cancel
                </button>
                <button
                  disabled={!photo}
                  onClick={confirmComplete}
                  className="flex-1 rounded-full bg-primary text-primary-foreground font-bold py-2.5 disabled:bg-muted disabled:text-muted-foreground hover:opacity-90"
                >
                  ✓ Mark as done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 pop-in">
          <div className="bg-primary text-primary-foreground font-bold px-5 py-3 rounded-full shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </EcoLayout>
  );
}
