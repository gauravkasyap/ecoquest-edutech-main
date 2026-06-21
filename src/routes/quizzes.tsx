import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EcoLayout } from "@/components/EcoLayout";
import { QUIZZES, completeQuiz, usePlayer } from "@/lib/ecoquest-store";

export const Route = createFileRoute("/quizzes")({
  head: () => ({
    meta: [
      { title: "Eco Quizzes — EcoQuest" },
      { name: "description", content: "Fun quizzes about the planet, water, waste, and trees." },
    ],
  }),
  component: QuizzesPage,
});

function QuizzesPage() {
  const player = usePlayer();
  const [activeIdx, setActiveIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const quiz = QUIZZES[activeIdx];
  const done = player.completedQuizzes.includes(quiz.id);

  const submit = () => {
    if (selected === null || revealed) return;
    setRevealed(true);
    completeQuiz(quiz, selected === quiz.answerIndex);
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setActiveIdx((i) => (i + 1) % QUIZZES.length);
  };

  return (
    <EcoLayout>
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Eco Quizzes 🧠</h1>
          <p className="text-sm text-muted-foreground">Answer right, earn points!</p>
        </div>
        <div className="text-sm font-semibold">
          Question {activeIdx + 1} / {QUIZZES.length}
        </div>
      </div>

      <div className="eco-card p-6">
        <p className="chip mb-3">+{quiz.points} pts</p>
        <h2 className="font-bold text-xl sm:text-2xl mb-5">{quiz.question}</h2>
        <div className="grid gap-3">
          {quiz.options.map((opt, i) => {
            const isCorrect = i === quiz.answerIndex;
            const isPicked = selected === i;
            let cls = "border-border bg-card hover:bg-muted";
            if (revealed && isCorrect) cls = "border-primary bg-primary/15 text-primary font-bold";
            else if (revealed && isPicked && !isCorrect)
              cls = "border-destructive bg-destructive/15 text-destructive font-bold";
            else if (isPicked) cls = "border-primary bg-primary/10";
            return (
              <button
                key={i}
                disabled={revealed || done}
                onClick={() => setSelected(i)}
                className={`text-left rounded-2xl border-2 px-4 py-3 transition ${cls}`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-5 p-4 rounded-2xl bg-muted">
            <p className="font-bold mb-1">
              {selected === quiz.answerIndex ? "🎉 Correct!" : "💡 Not quite."}
            </p>
            <p className="text-sm text-muted-foreground">{quiz.explanation}</p>
          </div>
        )}

        <div className="mt-5 flex gap-3 justify-end">
          {!revealed && !done && (
            <button
              disabled={selected === null}
              onClick={submit}
              className="rounded-full bg-primary text-primary-foreground font-bold px-6 py-2.5 disabled:bg-muted disabled:text-muted-foreground"
            >
              Submit
            </button>
          )}
          {(revealed || done) && (
            <button
              onClick={next}
              className="rounded-full bg-secondary text-secondary-foreground font-bold px-6 py-2.5"
            >
              Next question →
            </button>
          )}
        </div>
      </div>
    </EcoLayout>
  );
}
