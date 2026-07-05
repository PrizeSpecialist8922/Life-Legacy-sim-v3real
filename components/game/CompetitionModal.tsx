import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Trophy } from "lucide-react";
import { PREP_INFO, competitionName } from "../../game/activities";
import type { PrepLevel } from "../../game/activities";
import { buildQuiz } from "../../game/quiz";
import type { QuizCategory, QuizQuestion } from "../../game/quiz";
import type { CompetitionTicket } from "../../game/types";

const QUESTION_COUNT = 5;

/**
 * One major competition per activity per year: pick your preparation
 * intensity (study-time cost, sports injury risk), answer five subject
 * questions, then the engine decides the match against a rival school.
 */
export function CompetitionModal({
  ticket,
  onComplete,
  onSkip,
}: {
  ticket: CompetitionTicket | null;
  onComplete: (activity: string, prep: PrepLevel, ratio: number) => void;
  onSkip: (activity: string) => void;
}) {
  const [prep, setPrep] = useState<PrepLevel | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const questions: QuizQuestion[] = useMemo(() => {
    if (!ticket) return [];
    return buildQuiz(ticket.quizCategory as QuizCategory, QUESTION_COUNT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket?.activity]);

  if (!ticket) return null;
  const tk = ticket;
  const name = competitionName(tk);

  function reset() {
    setPrep(null);
    setQIdx(0);
    setCorrect(0);
    setPicked(null);
  }

  function answer(i: number) {
    if (picked !== null || !prep) return;
    setPicked(i);
    const isRight = i === questions[qIdx].answer;
    const nextCorrect = correct + (isRight ? 1 : 0);
    setCorrect(nextCorrect);
    setTimeout(() => {
      setPicked(null);
      if (qIdx + 1 < questions.length) {
        setQIdx(qIdx + 1);
      } else {
        const ratio = nextCorrect / questions.length;
        reset();
        onComplete(tk.activity, prep, ratio);
      }
    }, 450);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="glass-strong w-full max-w-md rounded-3xl p-6"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Trophy className="h-4 w-4" />{" "}
            {ticket.kind === "sport" ? "Championship Season" : "Competition Season"}
          </div>
          <h3 className="mt-1 text-lg font-bold">{name}</h3>
          <p className="text-xs text-muted-foreground">
            {ticket.activity} · vs{" "}
            <span className="font-semibold text-foreground">{ticket.rival}</span>
          </p>

          {!prep ? (
            <>
              <p className="mt-4 text-sm text-muted-foreground">
                {ticket.kind === "sport"
                  ? "How hard do you train this season? Intense training performs better but risks injury and eats study time."
                  : "How much do you prepare? Preparation costs study hours but wins trophies."}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {(Object.keys(PREP_INFO) as PrepLevel[]).map((lvl) => {
                  const info = PREP_INFO[lvl];
                  return (
                    <button
                      key={lvl}
                      onClick={() => setPrep(lvl)}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-primary/60 hover:bg-primary/10"
                    >
                      <p className="text-sm font-semibold">
                        {ticket.kind === "sport"
                          ? info.label.replace("preparation", "training")
                          : info.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        −{info.studyCost} study hrs · +{Math.round(info.bonus * 100)}% win chance
                        {ticket.kind === "sport"
                          ? ` · ${Math.round(info.injuryRisk * 100)}% injury risk`
                          : ""}
                      </p>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  reset();
                  onSkip(tk.activity);
                }}
                className="mt-3 w-full rounded-lg py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                Sit this one out
              </button>
            </>
          ) : (
            <>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Question {qIdx + 1} of {questions.length}
                </span>
                <span>
                  Correct: <span className="font-bold text-primary">{correct}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(qIdx / questions.length) * 100}%` }}
                />
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed">{questions[qIdx].q}</p>
              <div className="mt-3 flex flex-col gap-2">
                {questions[qIdx].options.map((opt, i) => {
                  const state =
                    picked === null
                      ? "idle"
                      : i === questions[qIdx].answer
                        ? "right"
                        : i === picked
                          ? "wrong"
                          : "idle";
                  return (
                    <button
                      key={i}
                      onClick={() => answer(i)}
                      className={`rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition ${
                        state === "right"
                          ? "border-[var(--success)] bg-[var(--success)]/15"
                          : state === "wrong"
                            ? "border-[var(--destructive)] bg-[var(--destructive)]/15"
                            : "border-white/10 bg-white/5 hover:border-primary/60 hover:bg-primary/10"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
