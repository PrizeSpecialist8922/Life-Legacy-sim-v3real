import type { Character } from "./types";
import { JOBS } from "./data";
import type { JobDef } from "./data";
import { INTERNSHIPS } from "./internships";
import type { InternshipDef } from "./internships";

// ---------------------------------------------------------------------------
// Special Careers Hub — the eleven prestige career tracks, each with a full
// page: education path, exams, licenses, recommended schools, economics,
// difficulty, and the positions currently open to the player.
// ---------------------------------------------------------------------------

export interface CareerPage {
  id: string;
  name: string;
  emoji: string;
  requiredEducation: string;
  requiredGpa: string;
  entranceExams: string;
  licenses: string;
  schools: string;
  prestige: number; // 1-100
  avgSalary: string;
  difficulty: number; // 1-5
  workLife: number; // 1-5, higher = better balance
  entryAge: string;
  howToEnter: string;
  jobIds: string[]; // matching JOBS entries (the ladder source)
  internIds: string[]; // matching INTERNSHIPS entries
}

export const CAREERS: CareerPage[] = [
  {
    id: "law",
    name: "Law",
    emoji: "\u2696\ufe0f",
    requiredEducation: "Bachelor's \u2192 JD (3 years)",
    requiredGpa: "3.4+ undergrad for top law schools",
    entranceExams: "LSAT (65th percentile+)",
    licenses: "Bar exam \u2014 mandatory to practice",
    schools: "Harvard Law, or the JD/MBA at Columbia",
    prestige: 92,
    avgSalary: "$215k starting at Big Law; partners $1M+",
    difficulty: 5,
    workLife: 1,
    entryAge: "25\u201326",
    howToEnter:
      "Strong undergrad GPA \u2192 crush the LSAT \u2192 JD \u2192 pass the bar \u2192 Big Law associate. Summer Associate internships during law school are the recruiting pipeline.",
    jobIds: ["biglaw"],
    internIds: ["law-sa", "law-judicial", "law-prosecutor", "law-defender", "hs-law"],
  },
  {
    id: "consulting",
    name: "Consulting",
    emoji: "\ud83d\udcca",
    requiredEducation: "Bachelor's; MBA required to pass Engagement Manager",
    requiredGpa: "3.6+ from a prestigious school",
    entranceExams: "GMAT for the MBA gate",
    licenses: "None",
    schools: "Any elite undergrad; Wharton MBA for the promotion gate",
    prestige: 88,
    avgSalary: "$110k analyst \u2192 $250k+ post-MBA",
    difficulty: 4,
    workLife: 2,
    entryAge: "22",
    howToEnter:
      "Elite GPA + a Consulting Summer Analyst internship \u2192 Business Analyst offer. You will stall at Consultant without an MBA \u2014 the Engagement Manager gate is hard.",
    jobIds: ["consultant"],
    internIds: ["co-consulting"],
  },
  {
    id: "banking",
    name: "Investment Banking",
    emoji: "\ud83c\udfe6",
    requiredEducation: "Bachelor's; MBA required to make Vice President",
    requiredGpa: "3.6+, finance or economics helps",
    entranceExams: "GMAT for the MBA gate",
    licenses: "None in-game",
    schools: "Target undergrad + top MBA",
    prestige: 90,
    avgSalary: "$150k analyst all-in \u2192 $500k+ MD",
    difficulty: 5,
    workLife: 1,
    entryAge: "22",
    howToEnter:
      "Summer Analyst internship is nearly mandatory \u2014 banks hire almost exclusively from their intern class. MBA required to be promoted to VP.",
    jobIds: ["analyst"],
    internIds: ["co-ib", "co-finance"],
  },
  {
    id: "medicine",
    name: "Medicine",
    emoji: "\ud83e\ude7a",
    requiredEducation: "Bachelor's \u2192 MD (4 years) \u2192 3-year residency",
    requiredGpa: "3.5+ with sciences",
    entranceExams: "MCAT (65th percentile+)",
    licenses: "MD + completed residency",
    schools: "Johns Hopkins School of Medicine",
    prestige: 95,
    avgSalary: "$62k resident \u2192 $280k+ attending",
    difficulty: 5,
    workLife: 2,
    entryAge: "29\u201330 (after residency)",
    howToEnter:
      "The longest path in the game: pre-med GPA \u2192 MCAT \u2192 4-year MD \u2192 hired as Medical Resident \u2192 3 full years before Attending. Hospital volunteering and clinical research internships strengthen your application.",
    jobIds: ["physician", "nurse"],
    internIds: ["co-health", "hs-hospital"],
  },
  {
    id: "tech",
    name: "Technology",
    emoji: "\ud83d\udcbb",
    requiredEducation: "Bachelor's (CS or engineering preferred)",
    requiredGpa: "3.2+; portfolio matters more than perfection",
    entranceExams: "None \u2014 technical interviews instead",
    licenses: "None",
    schools: "Any strong program; skills dominate",
    prestige: 82,
    avgSalary: "$120k junior \u2192 $400k+ staff at top firms",
    difficulty: 3,
    workLife: 4,
    entryAge: "21\u201322",
    howToEnter:
      "Software internships convert to full-time offers at high rates. Coding Club and Robotics competitions build the resume early.",
    jobIds: ["swe"],
    internIds: ["co-tech", "hs-startup"],
  },
  {
    id: "accounting",
    name: "Accounting",
    emoji: "\ud83e\uddfe",
    requiredEducation: "Bachelor's in accounting/business",
    requiredGpa: "3.0+",
    entranceExams: "None in-game (CPA path abstracted)",
    licenses: "CPA implied on the ladder",
    schools: "Any accredited program",
    prestige: 65,
    avgSalary: "$62k staff \u2192 $450k+ partner",
    difficulty: 2,
    workLife: 3,
    entryAge: "22",
    howToEnter:
      "The steadiest professional ladder: degree \u2192 staff accountant \u2192 grind to partner. Busy seasons hurt, stability compensates.",
    jobIds: ["accountant"],
    internIds: ["co-finance"],
  },
  {
    id: "engineering",
    name: "Engineering",
    emoji: "\ud83c\udfd7\ufe0f",
    requiredEducation: "Bachelor's in engineering",
    requiredGpa: "3.2+",
    entranceExams: "None in-game",
    licenses: "PE license implied at senior levels",
    schools: "Any ABET-style program; co-ops help",
    prestige: 75,
    avgSalary: "$74k junior \u2192 $220k+ chief engineer",
    difficulty: 3,
    workLife: 4,
    entryAge: "22",
    howToEnter:
      "Robotics and Science Olympiad in school, engineering degree, research internships \u2192 junior engineer. Reliable, respected, promotable.",
    jobIds: ["engineer"],
    internIds: ["co-lab", "hs-research"],
  },
  {
    id: "politics",
    name: "Politics",
    emoji: "\ud83c\udfdb\ufe0f",
    requiredEducation: "Bachelor's (political science, law common)",
    requiredGpa: "Networking beats GPA",
    entranceExams: "None \u2014 elections instead",
    licenses: "None",
    schools: "Prestige helps; alumni networks are currency",
    prestige: 85,
    avgSalary: "$85k councillor \u2192 $200k+ senator",
    difficulty: 4,
    workLife: 2,
    entryAge: "25+",
    howToEnter:
      "Student Government \u2192 political internships \u2192 city council at 25+. Networking and leadership positions are everything; a JD is the classic springboard.",
    jobIds: ["politician"],
    internIds: ["co-gov", "hs-gov"],
  },
  {
    id: "athlete",
    name: "Professional Athlete",
    emoji: "\ud83c\udfc5",
    requiredEducation: "None \u2014 talent and fitness",
    requiredGpa: "N/A (athletic scholarships need 2.5+)",
    entranceExams: "None \u2014 championships are the resume",
    licenses: "None",
    schools: "Athletic-powerhouse schools improve scouting odds",
    prestige: 88,
    avgSalary: "$120k rookie \u2192 $5M+ franchise player",
    difficulty: 5,
    workLife: 3,
    entryAge: "18\u201322 \u2014 the window closes fast",
    howToEnter:
      "Play school sports, train intensely, win championships. High fitness (80+) required; injuries can end everything. The shortest, riskiest career.",
    jobIds: ["athlete"],
    internIds: [],
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneurship",
    emoji: "\ud83d\ude80",
    requiredEducation: "None required \u2014 an MBA helps fundraising",
    requiredGpa: "Irrelevant",
    entranceExams: "None",
    licenses: "None",
    schools: "Dropout founders are a clich\u00e9 for a reason",
    prestige: 80,
    avgSalary: "$30k ramen years \u2192 unbounded",
    difficulty: 5,
    workLife: 1,
    entryAge: "Any \u2014 18+",
    howToEnter:
      "Start any time after 18. Low starting pay, brutal hours, highest ceiling in the game. Investment Club and startup internships teach the fundamentals.",
    jobIds: ["founder"],
    internIds: ["hs-startup", "hs-business"],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    emoji: "\ud83c\udfad",
    requiredEducation: "None \u2014 craft and luck",
    requiredGpa: "N/A",
    entranceExams: "Auditions, effectively",
    licenses: "None",
    schools: "Drama Club and Band are the training ground",
    prestige: 78,
    avgSalary: "$24k struggling \u2192 millions at the top",
    difficulty: 5,
    workLife: 3,
    entryAge: "16+",
    howToEnter:
      "Start performing young (Drama Club, Band, Art Club), grind as an aspiring performer, and survive long enough to headline. Happiness helps; stability does not apply.",
    jobIds: ["entertainer"],
    internIds: [],
  },
];

export function careerById(id: string): CareerPage | undefined {
  return CAREERS.find((cp) => cp.id === id);
}

export interface CareerPositions {
  jobs: JobDef[];
  internships: InternshipDef[];
}

/** Positions in this career track (whether or not the player qualifies yet). */
export function careerPositions(page: CareerPage): CareerPositions {
  return {
    jobs: JOBS.filter((j) => page.jobIds.includes(j.id)),
    internships: INTERNSHIPS.filter((i) => page.internIds.includes(i.id)),
  };
}

/** Requirements the player has already met, for the checklist UI. */
export function careerChecklist(c: Character, page: CareerPage): { label: string; met: boolean }[] {
  const out: { label: string; met: boolean }[] = [];
  const degrees = c.edu.degrees;
  if (page.id === "law") {
    out.push({ label: "Bachelor's degree", met: degrees.some((d) => d.startsWith("B.")) });
    out.push({ label: "LSAT taken", met: c.scores.lsat !== undefined });
    out.push({ label: "JD earned", met: degrees.includes("JD") });
    out.push({ label: "Bar exam passed", met: c.scores.bar === "passed" });
  } else if (page.id === "consulting" || page.id === "banking") {
    out.push({ label: "Bachelor's degree", met: degrees.some((d) => d.startsWith("B.")) });
    out.push({ label: "GPA 3.6+", met: c.gpa >= 3.6 });
    out.push({ label: "MBA (for senior promotions)", met: degrees.includes("MBA") });
  } else if (page.id === "medicine") {
    out.push({ label: "Bachelor's degree", met: degrees.some((d) => d.startsWith("B.")) });
    out.push({ label: "MCAT taken", met: c.scores.mcat !== undefined });
    out.push({ label: "MD earned", met: degrees.includes("MD") });
  } else if (page.id === "athlete") {
    out.push({ label: "Fitness 80+", met: c.fitness >= 80 });
    out.push({ label: "School sport played", met: c.edu.sports.length > 0 });
    out.push({
      label: "Championship won",
      met: c.edu.awards.some((a) => a.includes("Championship Champion")),
    });
  } else {
    out.push({ label: "Bachelor's degree", met: degrees.some((d) => d.startsWith("B.")) });
  }
  return out;
}
