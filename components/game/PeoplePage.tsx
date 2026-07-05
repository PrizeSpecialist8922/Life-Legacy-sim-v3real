import { useState } from "react";
import { Baby, Heart, Search, Users } from "lucide-react";
import {
  DATING_COUNTRIES,
  CHILD_ACTIONS,
  askOutChance,
  generateCandidates,
} from "../../game/dating";
import type { ChildAction } from "../../game/dating";
import type { ParentAction } from "../../game/engine";
import type { Character, DatingFilters, PartnerState } from "../../game/types";
import { formatMoney } from "../../game/util";

const PARENT_ACTIONS: { id: ParentAction; label: string }[] = [
  { id: "time", label: "Spend time" },
  { id: "advice", label: "Ask for advice" },
  { id: "money", label: "Ask for money" },
  { id: "tuition", label: "Ask for tuition help" },
  { id: "medical", label: "Ask for medical help" },
  { id: "dinner", label: "Family dinner" },
  { id: "vacation", label: "Family vacation" },
  { id: "gift", label: "Buy a gift" },
  { id: "apologize", label: "Apologize" },
  { id: "argue", label: "Argue" },
];

const STAGE_LABEL: Record<string, string> = {
  dating: "Dating",
  exclusive: "Exclusive",
  engaged: "Engaged \ud83d\udc8d",
  married: "Married \ud83d\udc92",
};

const NEXT_STEP: Record<string, string> = {
  dating: "Make it exclusive",
  exclusive: "Propose ($4,000)",
  engaged: "Get married ($15,000)",
};

export function PeoplePage({
  character,
  onParentAction,
  onAskOut,
  onPartnerTime,
  onProgress,
  onBreakUp,
  onHaveBaby,
  onChildAction,
}: {
  character: Character;
  onParentAction: (relId: string, action: ParentAction) => void;
  onAskOut: (cand: PartnerState) => void;
  onPartnerTime: () => void;
  onProgress: () => void;
  onBreakUp: () => void;
  onHaveBaby: () => void;
  onChildAction: (kidId: string, action: ChildAction) => void;
}) {
  const c = character;
  const family = c.relationships.filter(
    (r) => r.alive && (r.type === "mother" || r.type === "father" || r.type === "sibling"),
  );

  return (
    <div className="space-y-3">
      {/* Partner / Dating */}
      {c.partner ? (
        <PartnerCard
          c={c}
          onPartnerTime={onPartnerTime}
          onProgress={onProgress}
          onBreakUp={onBreakUp}
          onHaveBaby={onHaveBaby}
        />
      ) : c.age >= 16 ? (
        <DatingSearch c={c} onAskOut={onAskOut} />
      ) : null}

      {/* Children */}
      {(c.children?.length ?? 0) > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="mb-2 flex items-center gap-2">
            <Baby className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold">Your Children</h3>
          </div>
          <div className="space-y-3">
            {c.children!.map((kid) => (
              <div key={kid.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">
                    {kid.name}, {kid.age}
                  </p>
                  <span className="text-[11px] text-muted-foreground">{kid.school}</span>
                </div>
                <div className="mt-1.5 grid grid-cols-4 gap-2 text-center">
                  {(
                    [
                      ["Smarts", kid.smarts],
                      ["Happy", kid.happiness],
                      ["Health", kid.health],
                      ["Bond", kid.bond],
                    ] as const
                  ).map(([label, v]) => (
                    <div key={label} className="rounded-lg bg-white/5 py-1">
                      <p className="text-xs font-bold">{v}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(Object.keys(CHILD_ACTIONS) as ChildAction[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => onChildAction(kid.id, a)}
                      title={CHILD_ACTIONS[a].blurb}
                      className="rounded-lg bg-primary/15 px-2.5 py-1.5 text-[11px] font-semibold transition hover:bg-primary/25"
                    >
                      {CHILD_ACTIONS[a].label}
                      {CHILD_ACTIONS[a].cost ? ` (${formatMoney(CHILD_ACTIONS[a].cost)})` : ""}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parents & siblings */}
      <div className="glass rounded-2xl p-4">
        <div className="mb-2 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">Family</h3>
        </div>
        {family.length === 0 && (
          <p className="text-sm text-muted-foreground">No living family members.</p>
        )}
        <div className="space-y-3">
          {family.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">
                  {r.name}{" "}
                  <span className="text-[11px] font-normal capitalize text-muted-foreground">
                    ({r.type}, {r.age})
                  </span>
                </p>
                <span className="text-xs font-bold text-primary">{r.relationship}/100</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${r.relationship}%` }}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PARENT_ACTIONS.filter(
                  (a) =>
                    r.type !== "sibling" ||
                    ["time", "advice", "gift", "apologize", "argue"].includes(a.id),
                ).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => onParentAction(r.id, a.id)}
                    className="rounded-lg bg-white/8 px-2.5 py-1.5 text-[11px] font-semibold transition hover:bg-primary/20"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PartnerCard({
  c,
  onPartnerTime,
  onProgress,
  onBreakUp,
  onHaveBaby,
}: {
  c: Character;
  onPartnerTime: () => void;
  onProgress: () => void;
  onBreakUp: () => void;
  onHaveBaby: () => void;
}) {
  const p = c.partner!;
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-1 flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        <h3 className="text-base font-bold">
          {p.name}, {p.age}
        </h3>
        <span className="ml-auto rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] font-bold text-primary">
          {STAGE_LABEL[p.stage]}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {p.occupation} · {p.city}, {p.country} · {p.education} · earns {formatMoney(p.income)}/yr
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        {(
          [
            ["Bond", p.bond],
            ["Looks", p.looks],
            ["Personality", p.personality],
          ] as const
        ).map(([label, v]) => (
          <div key={label} className="rounded-lg bg-white/5 py-1.5">
            <p className="text-sm font-bold">{v}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        Together {p.yearsTogether} {p.yearsTogether === 1 ? "year" : "years"} — bonds fade without
        attention.
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          onClick={onPartnerTime}
          className="rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-semibold transition hover:bg-primary/25"
        >
          Spend time ($200)
        </button>
        {p.stage !== "married" && (
          <button
            onClick={onProgress}
            className="rounded-lg bg-[var(--success)]/20 px-3 py-1.5 text-xs font-semibold transition hover:bg-[var(--success)]/30"
          >
            {NEXT_STEP[p.stage]}
          </button>
        )}
        {p.stage !== "dating" && (
          <button
            onClick={onHaveBaby}
            className="rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-semibold transition hover:bg-primary/25"
          >
            Have a baby
          </button>
        )}
        <button
          onClick={onBreakUp}
          className="rounded-lg bg-[var(--destructive)]/15 px-3 py-1.5 text-xs font-semibold text-[var(--destructive)] transition hover:bg-[var(--destructive)]/25"
        >
          {p.stage === "married" ? "Divorce" : "Break up"}
        </button>
      </div>
    </div>
  );
}

function DatingSearch({ c, onAskOut }: { c: Character; onAskOut: (cand: PartnerState) => void }) {
  const [filters, setFilters] = useState<DatingFilters>({
    minAge: Math.max(18, c.age - 5),
    maxAge: c.age + 5,
    country: "any",
    education: "any",
  });
  const [candidates, setCandidates] = useState<PartnerState[]>([]);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-1 flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        <h3 className="text-base font-bold">Dating</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Set your filters and search. Asking someone out costs one action and $100.
      </p>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="text-[11px] text-muted-foreground">
          Age {filters.minAge}–{filters.maxAge}
          <input
            type="range"
            min={18}
            max={60}
            value={filters.maxAge}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxAge: Math.max(filters.minAge + 1, Number(e.target.value)),
              })
            }
            className="w-full accent-[var(--primary)]"
          />
        </label>
        <label className="text-[11px] text-muted-foreground">
          Country
          <select
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-foreground"
          >
            {DATING_COUNTRIES.map((co) => (
              <option key={co} value={co} className="bg-neutral-900">
                {co === "any" ? "Anywhere" : co}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[11px] text-muted-foreground">
          Education
          <select
            value={filters.education}
            onChange={(e) =>
              setFilters({ ...filters, education: e.target.value as DatingFilters["education"] })
            }
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-foreground"
          >
            <option value="any" className="bg-neutral-900">
              Any
            </option>
            <option value="college" className="bg-neutral-900">
              College+
            </option>
            <option value="graduate" className="bg-neutral-900">
              Graduate degree
            </option>
          </select>
        </label>
        <label className="text-[11px] text-muted-foreground">
          Min income
          <select
            value={filters.minIncome ?? 0}
            onChange={(e) => setFilters({ ...filters, minIncome: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-foreground"
          >
            <option value={0} className="bg-neutral-900">
              Any
            </option>
            <option value={50000} className="bg-neutral-900">
              $50k+
            </option>
            <option value={100000} className="bg-neutral-900">
              $100k+
            </option>
            <option value={200000} className="bg-neutral-900">
              $200k+
            </option>
          </select>
        </label>
      </div>

      <button
        onClick={() => setCandidates(generateCandidates(c, filters))}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:brightness-105"
      >
        <Search className="h-4 w-4" /> Search
      </button>

      {candidates.length > 0 && (
        <div className="mt-3 space-y-2">
          {candidates.map((cand, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">
                  {cand.name}, {cand.age}
                </p>
                <span className="text-[11px] text-muted-foreground">
                  ~{Math.round(askOutChance(c, cand) * 100)}% odds
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {cand.occupation} · {cand.city}, {cand.country} · {cand.education} ·{" "}
                {formatMoney(cand.income)}/yr
              </p>
              <p className="text-[11px] text-muted-foreground">
                Looks {cand.looks} · Personality {cand.personality} · Net worth{" "}
                {formatMoney(cand.netWorth)}
              </p>
              <button
                onClick={() => onAskOut(cand)}
                className="mt-2 w-full rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-bold transition hover:bg-primary/30"
              >
                Ask out
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
