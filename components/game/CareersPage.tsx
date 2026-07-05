import { useState } from "react";
import { ArrowLeft, Check, Compass, X } from "lucide-react";
import { CAREERS, careerChecklist, careerPositions } from "../../game/careers";
import type { CareerPage as CareerPageDef } from "../../game/careers";
import { eligibleJobDefs } from "../../game/engine";
import type { JobDef } from "../../game/data";
import type { Character } from "../../game/types";

function Dots({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-bold tracking-wider text-primary">
        {"\u25cf".repeat(n)}
        <span className="text-white/15">{"\u25cf".repeat(5 - n)}</span>
      </p>
    </div>
  );
}

/**
 * Special Careers Hub — the prestige professions, separated from ordinary
 * jobs, each with a full "how do I get there" page and live open positions.
 */
export function CareersPage({
  character,
  onApply,
}: {
  character: Character;
  onApply: (def: JobDef) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const page = CAREERS.find((cp) => cp.id === openId);

  if (page) {
    return (
      <CareerDetail
        character={character}
        page={page}
        onBack={() => setOpenId(null)}
        onApply={onApply}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="glass rounded-2xl p-4">
        <div className="mb-1 flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">Special Careers</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          The prestige professions. Each page shows exactly what it takes to get in — education,
          exams, licenses, and the ladder to the top.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {CAREERS.map((cp) => (
          <button
            key={cp.id}
            onClick={() => setOpenId(cp.id)}
            className="glass rounded-2xl p-3.5 text-left transition hover:border-primary/50 hover:bg-primary/5"
          >
            <p className="text-xl">{cp.emoji}</p>
            <p className="mt-1 text-sm font-bold">{cp.name}</p>
            <p className="text-[11px] text-muted-foreground">
              Prestige {cp.prestige} · Entry {cp.entryAge}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CareerDetail({
  character,
  page,
  onBack,
  onApply,
}: {
  character: Character;
  page: CareerPageDef;
  onBack: () => void;
  onApply: (def: JobDef) => void;
}) {
  const c = character;
  const { jobs, internships } = careerPositions(page);
  const checklist = careerChecklist(c, page);
  const eligibleIds = new Set(eligibleJobDefs(c).map((j) => j.id));

  const facts: { label: string; value: string }[] = [
    { label: "Required Education", value: page.requiredEducation },
    { label: "GPA Bar", value: page.requiredGpa },
    { label: "Entrance Exams", value: page.entranceExams },
    { label: "Licenses", value: page.licenses },
    { label: "Recommended Schools", value: page.schools },
    { label: "Average Salary", value: page.avgSalary },
    { label: "Typical Entry Age", value: page.entryAge },
  ];

  return (
    <div className="space-y-3">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All careers
      </button>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {page.emoji} {page.name}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{page.howToEnter}</p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
            Prestige {page.prestige}
          </span>
        </div>
        <div className="mt-3 flex gap-6">
          <Dots n={page.difficulty} label="Difficulty" />
          <Dots n={page.workLife} label="Work-Life Balance" />
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <h4 className="mb-2 text-sm font-bold">Requirements</h4>
        <div className="space-y-1.5">
          {facts.map((f) => (
            <div key={f.label} className="rounded-lg bg-white/5 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{f.label}</p>
              <p className="text-xs font-medium">{f.value}</p>
            </div>
          ))}
        </div>
        <h4 className="mb-1.5 mt-3 text-sm font-bold">Your Progress</h4>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {checklist.map((r) => (
            <div key={r.label} className="flex items-center gap-1.5 text-xs">
              {r.met ? (
                <Check className="h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
              ) : (
                <X className="h-3.5 w-3.5 shrink-0 text-[var(--destructive)]" />
              )}
              <span className={r.met ? "text-muted-foreground" : ""}>{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <h4 className="mb-2 text-sm font-bold">Promotion Ladder</h4>
        {jobs.map((j) => (
          <div key={j.id} className="mb-2">
            <div className="flex flex-wrap items-center gap-1">
              {j.ladder.map((t, i) => {
                const gate = j.promotionGates?.find((g) => g.level === i);
                return (
                  <span key={t} className="flex items-center gap-1 text-[11px]">
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${
                        c.job?.id === j.id && c.job.level === i
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/8 text-muted-foreground"
                      }`}
                    >
                      {t}
                      {gate?.degree ? ` \ud83d\udd12${gate.degree}` : ""}
                      {gate?.minYearsAtLevel ? ` \ud83d\udd52${gate.minYearsAtLevel}y` : ""}
                    </span>
                    {i < j.ladder.length - 1 && <span className="text-white/25">\u2192</span>}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4">
        <h4 className="mb-2 text-sm font-bold">Open Positions</h4>
        <div className="space-y-2">
          {jobs.map((j) => {
            const can = eligibleIds.has(j.id) && !c.job;
            return (
              <div
                key={j.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div>
                  <p className="text-sm font-semibold">{j.ladder[0]}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {j.company} · ${j.baseSalary.toLocaleString()}/yr
                    {j.degreeReq ? ` · needs ${j.degreeReq}` : ""}
                    {j.requiresBar ? " + bar" : ""}
                    {j.minFitness ? ` · fitness ${j.minFitness}+` : ""}
                  </p>
                </div>
                <button
                  disabled={!can}
                  onClick={() => onApply(j)}
                  className="shrink-0 rounded-lg bg-primary/20 px-3.5 py-1.5 text-xs font-bold transition hover:bg-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {c.job?.id === j.id ? "Current" : "Apply"}
                </button>
              </div>
            );
          })}
          {internships.map((i) => (
            <div key={i.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-sm font-semibold">
                {i.name}{" "}
                <span className="text-[11px] font-normal text-muted-foreground">(internship)</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                {i.org} ·{" "}
                {i.level === "law"
                  ? "law students only"
                  : i.level === "high"
                    ? "high school"
                    : "college"}{" "}
                · apply from the Interns tab
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
