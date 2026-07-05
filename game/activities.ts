import type { Character, CompetitionTicket, LogEntry } from "./types";
import type { QuizCategory } from "./quiz";
import { clamp, randInt, randItem } from "./util";

// ---------------------------------------------------------------------------
// Interactive extracurriculars: every club or sport generates ONE major
// competition per academic year, played against a rival school. The player
// picks preparation intensity (which costs study time), answers a short
// subject quiz, and the combined result decides the outcome.
// Max 3 total activities — commitment matters.
// ---------------------------------------------------------------------------

export const MAX_ACTIVITIES = 3;

export type PrepLevel = "intense" | "moderate" | "minimal";

export const PREP_INFO: Record<
  PrepLevel,
  { label: string; studyCost: number; bonus: number; injuryRisk: number }
> = {
  intense: { label: "Intensive preparation", studyCost: 10, bonus: 0.22, injuryRisk: 0.18 },
  moderate: { label: "Moderate preparation", studyCost: 5, bonus: 0.1, injuryRisk: 0.07 },
  minimal: { label: "Minimal preparation", studyCost: 1, bonus: 0, injuryRisk: 0.02 },
};

/** Which quiz bank a given activity draws from. */
export function activityQuizCategory(activity: string): QuizCategory {
  switch (activity) {
    case "Debate Team":
    case "Model UN":
      return "comp_debate";
    case "Robotics":
    case "Coding Club":
      return "comp_engineering";
    case "Investment Club":
      return "comp_finance";
    case "Student Council":
      return "comp_leadership";
    case "Math Team":
      return "ib_math";
    case "Science Olympiad":
      return "ib_science";
    case "Chess Club":
    case "Band":
    case "Art Club":
    case "Drama Club":
      return "comp_general";
    default:
      return "comp_sports"; // all sports
  }
}

const RIVALS = [
  "St. Aldric's Academy",
  "Northbridge Collegiate",
  "Ridgeview Preparatory",
  "Kingsmoor School",
  "Lakefield Institute",
  "Harrowgate High",
];

/** The competition name shown for each activity. */
export function competitionName(t: CompetitionTicket): string {
  if (t.kind === "sport") return `${t.activity} Championship`;
  switch (t.activity) {
    case "Debate Team":
      return "Regional Debate Tournament";
    case "Investment Club":
      return "National Stock Pitch Competition";
    case "Robotics":
      return "State Robotics Championship";
    case "Student Council":
      return "Student Government Election";
    case "Model UN":
      return "Model UN Conference";
    case "Science Olympiad":
      return "Science Olympiad Regionals";
    case "Math Team":
      return "Regional Math Olympiad";
    default:
      return `${t.activity} Showcase`;
  }
}

/** Build this year's competition tickets (one per activity, capped). */
export function buildCompetitionTickets(c: Character): CompetitionTicket[] {
  if (!["middle", "high", "college"].includes(c.education)) return [];
  const activities: { name: string; kind: "club" | "sport" }[] = [
    ...c.edu.clubs.map((n) => ({ name: n, kind: "club" as const })),
    ...c.edu.sports.map((n) => ({ name: n, kind: "sport" as const })),
  ].slice(0, MAX_ACTIVITIES);
  return activities.map((a) => ({
    activity: a.name,
    kind: a.kind,
    quizCategory: activityQuizCategory(a.name),
    rival: randItem(RIVALS),
  }));
}

export interface CompetitionOutcome {
  won: boolean;
  injured: boolean;
  text: string;
  tone: "milestone" | "good" | "neutral" | "bad";
}

/**
 * Resolve a competition. Win chance blends quiz performance, preparation,
 * raw ability (smarts for clubs, fitness for sports), and school quality.
 */
export function resolveCompetition(
  c: Character,
  ticket: CompetitionTicket,
  prep: PrepLevel,
  quizRatio: number,
  log: LogEntry[],
): CompetitionOutcome {
  const info = PREP_INFO[prep];
  c.edu.studyHours = Math.max(0, c.edu.studyHours - info.studyCost);

  const ability = ticket.kind === "sport" ? c.fitness : c.stats.smarts;
  const schoolEdge = ((c.edu.schoolPrestige ?? 55) - 55) / 400; // elite schools field stronger teams
  const winP = clamp01(0.18 + quizRatio * 0.42 + info.bonus + (ability - 50) / 220 + schoolEdge);
  const won = Math.random() < winP;

  // Sports carry injury risk, scaled by training intensity.
  let injured = false;
  if (ticket.kind === "sport" && Math.random() < info.injuryRisk) {
    injured = true;
    c.stats.health = clamp(c.stats.health - randInt(8, 18));
    c.fitness = clamp(c.fitness - randInt(5, 12));
  }

  const name = competitionName(ticket);
  if (won) {
    c.edu.awards.push(`${name} Champion vs ${ticket.rival} (age ${c.age})`);
    c.stats.happiness = clamp(c.stats.happiness + 6);
    if (ticket.kind === "sport") c.fitness = clamp(c.fitness + 3);
    else c.stats.smarts = clamp(c.stats.smarts + 2);
    // Captains/leads emerge from winning teams.
    if (Math.random() < 0.35) {
      const title =
        ticket.kind === "sport"
          ? `Team Captain, ${ticket.activity}`
          : `${ticket.activity} Team Lead`;
      if (!(c.edu.leadership ?? []).includes(title)) {
        c.edu.leadership = [...(c.edu.leadership ?? []), title];
      }
    }
  } else {
    c.stats.happiness = clamp(c.stats.happiness - 2);
  }

  const injuryText = injured ? " You picked up an injury pushing that hard." : "";
  const text = won
    ? `You beat ${ticket.rival} at the ${name}! The trophy is yours.${injuryText}`
    : `${ticket.rival} edged you out at the ${name}. ${quizRatio >= 0.8 ? "Brutal luck — you performed well." : "More preparation next season."}${injuryText}`;

  log.push({ age: c.age, text, tone: won ? "milestone" : "neutral" });
  return { won, injured, text, tone: won ? "milestone" : injured ? "bad" : "neutral" };
}

function clamp01(n: number): number {
  return Math.max(0.03, Math.min(0.95, n));
}
