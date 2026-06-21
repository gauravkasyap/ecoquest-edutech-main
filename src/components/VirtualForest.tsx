export function VirtualForest({ trees, points }: { trees: number; points: number }) {
  // Forest grows with trees planted + bonus growth tier from points
  const tier = points >= 1000 ? 4 : points >= 500 ? 3 : points >= 200 ? 2 : points >= 50 ? 1 : 0;
  const treeCount = Math.min(trees + tier, 12);
  const treeEmojis = ["🌱", "🌿", "🌳", "🌲"];
  const items = Array.from({ length: Math.max(treeCount, 1) }).map((_, i) => {
    const grown = i < tier + trees;
    const emoji = grown ? treeEmojis[Math.min(3, Math.floor((i + tier) / 3))] : "🌱";
    return { emoji, key: i };
  });

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border">
      <div
        className="relative h-56 sm:h-64"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in oklab, var(--sky) 55%, white) 0%, color-mix(in oklab, var(--sky) 25%, white) 55%, color-mix(in oklab, var(--leaf) 35%, white) 55%, color-mix(in oklab, var(--leaf) 60%, white) 100%)",
        }}
      >
        {/* Sun */}
        <div className="absolute top-4 right-6 w-12 h-12 rounded-full bg-accent shadow-[0_0_40px_8px_color-mix(in_oklab,var(--sun)_60%,transparent)]" />
        {/* Clouds */}
        <div className="absolute top-6 left-8 text-3xl opacity-80">☁️</div>
        <div className="absolute top-10 left-1/3 text-2xl opacity-70">☁️</div>

        {/* Trees on ground */}
        <div className="absolute bottom-2 inset-x-0 flex items-end justify-around px-3 pb-1">
          {items.map((t, i) => (
            <span
              key={t.key}
              className="tree-sway text-3xl sm:text-4xl"
              style={{
                animationDelay: `${(i % 5) * 0.3}s`,
                transform: `translateY(${(i % 2) * -4}px)`,
              }}
            >
              {t.emoji}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-3 bg-card">
        <div className="text-sm text-muted-foreground">Your virtual forest</div>
        <div className="text-sm font-semibold">
          🌳 {trees} planted · Growth tier {tier}
        </div>
      </div>
    </div>
  );
}
