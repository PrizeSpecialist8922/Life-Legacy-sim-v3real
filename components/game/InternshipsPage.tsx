import { Briefcase, Lock } from "lucide-react";
import {
  alreadyAppliedThisYear,
  availableInternships,
  INTERNSHIP_MAX_AGE,
  internshipChance,
  internshipEligibility,
} from "../../game/internships";
import { ACTIONS_PER_YEAR } from "../../game/engine";
import type { Character } from "../../game/types";

/**
 * Dedicated Internships page — separate from Jobs and Education. Open during
 * high school (15+) and college/graduate school; locked after age 30.
 */
export function InternshipsPage({
  character,
  onApply,
}: {
  character: Character;
  onApply: (id: string) => void;
}) {
  const c = character;
  const elig = internshipEligibility(c);
  const energyLeft = ACTIONS_PER_YEAR - c.yearActionsUsed;
  const history = c.edu.internships ?? [];

  return (
    <div className="space-y-3">
      <div className="glass rounded-2xl p-4">
        <div className="mb-1 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">Internships</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Internships build your resume, network, and job prospects. Applications consider your GPA,
          school prestige, leadership, research, awards, recommendation letters, and network.
        </p>
        {elig.eligible && (
          <p className="mt-2 text-xs text-muted-foreground">
            Energy this year: <span className="font-bold text-primary">{energyLeft}</span> /{" "}
            {ACTIONS_PER_YEAR}
          </p>
        )}
      </div>

      {!elig.eligible ? (
        <div className="glass rounded-2xl p-6 text-center">
          <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-semibold">
            {c.age > INTERNSHIP_MAX_AGE
              ? "You are no longer eligible for traditional student internships."
              : "Internships aren't open to you yet."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {c.age > INTERNSHIP_MAX_AGE
              ? "That chapter has closed — career actions and networking are your tools now."
              : (elig.reason ?? "")}
          </p>
        </div>
      ) : (
        <div className="glass rounded-2xl p-4">
          <h4 className="mb-1 text-sm font-bold">
            {elig.level === "high"
              ? "High School Programs"
              : elig.level === "law"
                ? "Law School Recruiting"
                : "College & Graduate Programs"}
          </h4>
          <p className="mb-2 text-[11px] text-muted-foreground">
            Openings refresh every year — one application per program per year.
            {elig.level === "law" ? " Summer Associate roles are exclusive to law students." : ""}
          </p>
          <div className="space-y-2">
            {availableInternships(c, elig.level!).map((d) => {
              const { probability } = internshipChance(c, d);
              const applied = alreadyAppliedThisYear(c, d.id);
              return (
                <div key={d.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.org} · {d.field} · Prestige {d.prestige}
                      </p>
                    </div>
                    <button
                      disabled={energyLeft <= 0 || applied}
                      onClick={() => onApply(d.id)}
                      className="shrink-0 rounded-lg bg-primary/20 px-3.5 py-1.5 text-xs font-bold transition hover:bg-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {applied ? "Applied" : "Apply"}
                    </button>
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">{d.blurb}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Min GPA {d.minGpa.toFixed(1)} · Your odds:{" "}
                    <span
                      className={`font-bold ${probability >= 0.5 ? "text-[var(--success)]" : probability >= 0.25 ? "text-foreground" : "text-[var(--destructive)]"}`}
                    >
                      {Math.round(probability * 100)}%
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(c.edu.internships ?? []).some((i) => i.outcome !== "accepted" || i.recLetter) && (
        <div className="glass rounded-2xl p-4">
          <h4 className="mb-2 text-sm font-bold">Return Offers & Outcomes</h4>
          <div className="space-y-1.5">
            {(c.edu.internships ?? [])
              .filter((i) => i.outcome !== "accepted" || i.recLetter)
              .map((i, k) => (
                <div key={k} className="rounded-lg bg-white/5 px-3 py-2 text-xs">
                  <p className="font-semibold">
                    {i.name} <span className="font-normal text-muted-foreground">· {i.org}</span>
                  </p>
                  <p className="mt-0.5 text-[11px]">
                    {i.outcome === "fulltime" && (
                      <span className="font-bold text-[var(--success)]">
                        Full-time offer extended
                      </span>
                    )}
                    {i.outcome === "return" && (
                      <span className="font-bold text-primary">Return offer for next summer</span>
                    )}
                    {i.outcome === "accepted" && (
                      <span className="text-muted-foreground">Completed</span>
                    )}
                    {i.recLetter && (
                      <span className="text-muted-foreground">
                        {" "}
                        · recommendation letter secured
                      </span>
                    )}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h4 className="mb-2 text-sm font-bold">Internship History</h4>
          <ul className="space-y-1.5">
            {[...history].reverse().map((i, idx) => (
              <li key={idx} className="rounded-lg bg-white/5 px-3 py-2 text-xs">
                <span className="font-semibold">{i.name}</span> — {i.org} (age {i.age})
                <span className="text-muted-foreground">
                  {i.outcome === "fulltime" && " · full-time offer"}
                  {i.outcome === "return" && " · return offer"}
                  {i.recLetter && " · recommendation letter"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
