import type { Character, ChildState, DatingFilters, LogEntry, PartnerState } from "./types";
import { clamp, randInt, randItem } from "./util";
import { COUNTRY_CITIES, citiesFor } from "./data";

// ---------------------------------------------------------------------------
// Dating, marriage, and a deep children system. Candidates are generated
// against the player's filters; relationships progress meet -> date ->
// exclusive -> engaged -> married; children are full little people who age,
// go to school, and grow based on how you parent them.
// ---------------------------------------------------------------------------

const FEMALE_NAMES = [
  "Sophia",
  "Emma",
  "Olivia",
  "Ava",
  "Mia",
  "Isabella",
  "Amara",
  "Yuki",
  "Priya",
  "Camila",
  "Zara",
  "Elena",
];
const MALE_NAMES = [
  "Liam",
  "Noah",
  "Ethan",
  "Lucas",
  "Kai",
  "Mateo",
  "Arjun",
  "Hiro",
  "Tunde",
  "Felix",
  "Omar",
  "Leo",
];
const OCCUPATIONS = [
  { name: "Teacher", income: 52000 },
  { name: "Nurse", income: 68000 },
  { name: "Software Developer", income: 115000 },
  { name: "Marketing Manager", income: 82000 },
  { name: "Accountant", income: 70000 },
  { name: "Physician", income: 240000 },
  { name: "Attorney", income: 180000 },
  { name: "Chef", income: 48000 },
  { name: "Architect", income: 90000 },
  { name: "Entrepreneur", income: 95000 },
  { name: "Graphic Designer", income: 58000 },
  { name: "Financial Analyst", income: 98000 },
];
const EDUCATIONS = ["High School", "Bachelor's", "Bachelor's", "Master's", "MBA", "JD", "MD"];

export function generateCandidates(c: Character, f: DatingFilters, count = 3): PartnerState[] {
  const out: PartnerState[] = [];
  const gender = c.gender === "male" ? "female" : "male"; // simple default pairing
  for (let i = 0; i < count; i++) {
    const country = f.country && f.country !== "any" ? f.country : c.country;
    const occ = randItem(OCCUPATIONS);
    let education = randItem(EDUCATIONS);
    if (f.education === "college" && education === "High School") education = "Bachelor's";
    if (f.education === "graduate") education = randItem(["Master's", "MBA", "JD", "MD"]);
    const income = Math.round(occ.income * (0.7 + Math.random() * 0.8));
    out.push({
      name: randItem(gender === "female" ? FEMALE_NAMES : MALE_NAMES),
      gender,
      age: randInt(Math.max(18, f.minAge), Math.max(f.minAge + 1, f.maxAge)),
      country,
      city: randItem(citiesFor(country)),
      education,
      occupation: occ.name,
      income: Math.max(income, f.minIncome ?? 0),
      netWorth: Math.round(income * randInt(1, 6)),
      looks: Math.max(f.minLooks ?? 0, randInt(30, 95)),
      personality: Math.max(f.minPersonality ?? 0, randInt(30, 95)),
      bond: 0,
      stage: "dating",
      yearsTogether: 0,
    });
  }
  return out;
}

export const DATING_COUNTRIES = ["any", ...Object.keys(COUNTRY_CITIES)];

/** Chance a candidate says yes to a first date. */
export function askOutChance(c: Character, cand: PartnerState): number {
  let p = 0.45;
  p += (c.stats.happiness - 50) / 300; // confidence
  p += (c.stats.looks - 50) / 250;
  if (c.job) p += 0.08;
  if ((cand.looks + cand.personality) / 2 > 80) p -= 0.15; // stunners are picky
  return Math.max(0.1, Math.min(0.9, p));
}

// ---------------------------------------------------------------------------
// Yearly relationship + children ticks (called from the engine's ageUp)
// ---------------------------------------------------------------------------

export function partnerTick(c: Character, log: LogEntry[]) {
  const p = c.partner;
  if (!p) return;
  p.age += 1;
  p.yearsTogether += 1;
  // Bonds decay without attention; married bonds are stickier.
  const decay = p.stage === "married" ? 2 : 4;
  p.bond = clamp(p.bond - decay + randInt(0, 2));
  // Spouse contributes to household finances.
  if (p.stage === "married") {
    c.money += Math.round(p.income * 0.25);
  }
  if (p.bond <= 10 && p.stage !== "married") {
    log.push({
      age: c.age,
      text: `${p.name} ended things \u2014 the relationship had been running on fumes.`,
      tone: "bad",
    });
    c.partner = undefined;
    c.stats.happiness = clamp(c.stats.happiness - 8);
  } else if (p.bond <= 6 && p.stage === "married") {
    log.push({
      age: c.age,
      text: `${p.name} filed for divorce. Half of everything, gone.`,
      tone: "bad",
    });
    c.money = Math.round(c.money / 2);
    c.partner = undefined;
    c.stats.happiness = clamp(c.stats.happiness - 12);
  }
}

const CHILD_COST_YOUNG = 9000;
const CHILD_COST_TEEN = 14000;

export function childrenTick(c: Character, log: LogEntry[]) {
  if (!c.children?.length) return;
  for (const kid of c.children) {
    kid.age += 1;
    c.money -= kid.age >= 13 ? CHILD_COST_TEEN : CHILD_COST_YOUNG;
    // Stats drift; strong bonds buffer, neglect erodes.
    const bondPull = (kid.bond - 50) / 25;
    kid.happiness = clamp(kid.happiness + randInt(-3, 2) + bondPull);
    kid.smarts = clamp(kid.smarts + randInt(-1, 2) + (kid.happiness > 60 ? 1 : 0));
    kid.health = clamp(kid.health + randInt(-2, 1));
    kid.bond = clamp(kid.bond - 3); // bonds need maintenance
    // School stages
    if (kid.age === 5) {
      kid.school = "Elementary School";
      log.push({ age: c.age, text: `${kid.name} started elementary school.`, tone: "neutral" });
    } else if (kid.age === 11) kid.school = "Middle School";
    else if (kid.age === 14) kid.school = "High School";
    else if (kid.age === 18) {
      kid.school = kid.smarts >= 60 ? "University" : "Working";
      log.push({
        age: c.age,
        text:
          kid.smarts >= 60
            ? `${kid.name} got into university! ${kid.smarts >= 85 ? "A top school, no less." : ""}`
            : `${kid.name} skipped university and started working.`,
        tone: kid.smarts >= 60 ? "milestone" : "neutral",
      });
    } else if (kid.age === 22 && kid.school === "University") {
      kid.school = "Graduated";
      log.push({ age: c.age, text: `${kid.name} graduated from university!`, tone: "milestone" });
    }
  }
}

export type ChildAction = "homework" | "play" | "vacation" | "tutor" | "talk";

export const CHILD_ACTIONS: Record<ChildAction, { label: string; cost: number; blurb: string }> = {
  homework: { label: "Help with homework", cost: 0, blurb: "+Smarts, +Bond" },
  play: { label: "Play together", cost: 0, blurb: "+Happiness, +Bond" },
  vacation: { label: "Family vacation", cost: 6000, blurb: "Big +Happiness, +Bond for everyone" },
  tutor: { label: "Hire a tutor", cost: 3000, blurb: "Big +Smarts" },
  talk: { label: "Heart-to-heart talk", cost: 0, blurb: "+Bond, helps a struggling kid" },
};

export function applyChildAction(c: Character, kid: ChildState, action: ChildAction): string {
  switch (action) {
    case "homework":
      kid.smarts = clamp(kid.smarts + randInt(2, 4));
      kid.bond = clamp(kid.bond + 5);
      return `You spent evenings on homework with ${kid.name}. Their grades \u2014 and your bond \u2014 improved.`;
    case "play":
      kid.happiness = clamp(kid.happiness + randInt(4, 8));
      kid.bond = clamp(kid.bond + 8);
      c.stats.happiness = clamp(c.stats.happiness + 3);
      return `An afternoon of pure play with ${kid.name}. These are the years that matter.`;
    case "vacation":
      c.money -= CHILD_ACTIONS.vacation.cost;
      kid.happiness = clamp(kid.happiness + 12);
      kid.bond = clamp(kid.bond + 10);
      c.stats.happiness = clamp(c.stats.happiness + 6);
      if (c.partner) c.partner.bond = clamp(c.partner.bond + 8);
      return `A family vacation to remember. Everyone came home closer.`;
    case "tutor":
      c.money -= CHILD_ACTIONS.tutor.cost;
      kid.smarts = clamp(kid.smarts + randInt(5, 9));
      return `The tutor is working \u2014 ${kid.name}'s marks jumped noticeably.`;
    case "talk":
      kid.bond = clamp(kid.bond + 10);
      kid.happiness = clamp(kid.happiness + (kid.happiness < 40 ? 8 : 3));
      return `You and ${kid.name} really talked. ${kid.happiness < 50 ? "They needed it more than you knew." : "You know them a little better now."}`;
  }
}

export function makeBaby(c: Character): ChildState {
  const gender = Math.random() < 0.5 ? "male" : "female";
  return {
    id: `kid-${Date.now()}-${Math.floor(Math.random() * 1e4)}`,
    name: randItem(gender === "female" ? FEMALE_NAMES : MALE_NAMES),
    gender,
    age: 0,
    smarts: randInt(35, 70),
    happiness: randInt(60, 85),
    health: randInt(70, 95),
    bond: 70,
    school: "Home",
  };
}
