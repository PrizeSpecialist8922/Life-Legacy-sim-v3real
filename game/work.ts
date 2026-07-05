import type { GameEvent } from "./types";
import { clamp, randInt } from "./util";

// ---------------------------------------------------------------------------
// Interactive work: employed characters get one rich workplace event per
// year. Choices trade off performance, burnout, reputation (networking),
// bonuses, and happiness. Prefixed "work_" so the engine can prioritize them.
// ---------------------------------------------------------------------------

function burn(c: { burnout?: number }, delta: number) {
  c.burnout = clamp((c.burnout ?? 0) + delta);
}

export const WORK_EVENTS: GameEvent[] = [
  {
    id: "work_difficult_client",
    title: "The Client From Hell",
    description:
      "A major client keeps rejecting deliverables and copying your boss on angry emails. The account is worth a fortune.",
    minAge: 16,
    maxAge: 70,
    weight: 5,
    condition: (c) => !!c.job,
    choices: [
      {
        label: "Fly out and fix it in person",
        apply: (c) => {
          burn(c, 8);
          if (Math.random() < 0.4 + c.stats.smarts / 300) {
            c.job!.performance = clamp(c.job!.performance + 12);
            c.networking = clamp((c.networking ?? 0) + 5);
            return {
              text: "You salvaged the account face-to-face. Your boss noticed — and so did the client's CEO.",
              tone: "good",
            };
          }
          c.job!.performance = clamp(c.job!.performance - 5);
          return { text: "The trip didn't fix it. At least you tried publicly.", tone: "neutral" };
        },
      },
      {
        label: "Quietly hand the account to a colleague",
        apply: (c) => {
          c.job!.performance = clamp(c.job!.performance - 3);
          c.stats.happiness = clamp(c.stats.happiness + 3);
          return {
            text: "You off-loaded the nightmare. Peace restored, but leadership logged who folded.",
            tone: "neutral",
          };
        },
      },
      {
        label: "Push back on the client's demands",
        apply: (c) => {
          if (Math.random() < 0.5) {
            c.job!.performance = clamp(c.job!.performance + 8);
            return {
              text: "You set boundaries and the client respected it. Deliverables approved.",
              tone: "good",
            };
          }
          c.job!.performance = clamp(c.job!.performance - 10);
          return { text: "The client escalated to your boss. Rough quarter ahead.", tone: "bad" };
        },
      },
    ],
  },
  {
    id: "work_highprofile_project",
    title: "High-Profile Project",
    description:
      "Leadership is staffing a make-or-break project with executive visibility. Volunteers work brutal hours.",
    minAge: 16,
    maxAge: 70,
    weight: 5,
    condition: (c) => !!c.job,
    choices: [
      {
        label: "Volunteer to lead a workstream",
        apply: (c) => {
          burn(c, 12);
          c.stats.happiness = clamp(c.stats.happiness - 3);
          if (Math.random() < 0.45 + c.stats.smarts / 250) {
            c.job!.performance = clamp(c.job!.performance + 15);
            c.money += Math.round(c.job!.salary * 0.08);
            return {
              text: "The project shipped and your name was on it. Spot bonus paid, promotion case building.",
              tone: "milestone",
            };
          }
          c.job!.performance = clamp(c.job!.performance + 3);
          return {
            text: "The project slipped, but leading under pressure still taught you plenty.",
            tone: "neutral",
          };
        },
      },
      {
        label: "Join as a contributor",
        apply: (c) => {
          burn(c, 5);
          c.job!.performance = clamp(c.job!.performance + 6);
          return { text: "Solid, visible work without the crushing hours.", tone: "good" };
        },
      },
      {
        label: "Sit this one out",
        apply: (c) => {
          burn(c, -6);
          c.stats.happiness = clamp(c.stats.happiness + 3);
          return {
            text: "You protected your evenings. The volunteers now outrank you in visibility.",
            tone: "neutral",
          };
        },
      },
    ],
  },
  {
    id: "work_overtime",
    title: "Overtime Request",
    description:
      "Your manager asks you to work weekends this quarter to cover a departing teammate.",
    minAge: 16,
    maxAge: 70,
    weight: 4,
    condition: (c) => !!c.job,
    choices: [
      {
        label: "Take the weekends",
        apply: (c) => {
          burn(c, 10);
          c.stats.happiness = clamp(c.stats.happiness - 4);
          c.job!.performance = clamp(c.job!.performance + 8);
          c.money += Math.round(c.job!.salary * 0.05);
          return {
            text: "Exhausting quarter, grateful manager, overtime pay banked.",
            tone: "good",
          };
        },
      },
      {
        label: "Negotiate: weekdays only, but full ownership",
        apply: (c) => {
          if (Math.random() < 0.6) {
            c.job!.performance = clamp(c.job!.performance + 6);
            return {
              text: "Your manager took the deal. Ownership without the weekends.",
              tone: "good",
            };
          }
          c.job!.performance = clamp(c.job!.performance - 4);
          return {
            text: "The negotiation read as reluctance. Someone else got the work.",
            tone: "neutral",
          };
        },
      },
      {
        label: "Decline — boundaries",
        apply: (c) => {
          burn(c, -8);
          c.stats.happiness = clamp(c.stats.happiness + 4);
          c.job!.performance = clamp(c.job!.performance - 4);
          return {
            text: "Your weekends stayed yours. Your manager's memory is long.",
            tone: "neutral",
          };
        },
      },
    ],
  },
  {
    id: "work_networking_dinner",
    title: "Executive Networking Dinner",
    description:
      "You're invited to a dinner with senior executives. Everyone is watching who talks to whom.",
    minAge: 18,
    maxAge: 70,
    weight: 4,
    condition: (c) => !!c.job,
    choices: [
      {
        label: "Work the room strategically",
        apply: (c) => {
          c.networking = clamp((c.networking ?? 0) + randInt(8, 14));
          if (Math.random() < 0.25) {
            c.job!.performance = clamp(c.job!.performance + 6);
            return {
              text: "An executive remembered your name in Monday's meeting. That's how careers move.",
              tone: "milestone",
            };
          }
          return {
            text: "Cards exchanged, impressions made. Your network is visibly stronger.",
            tone: "good",
          };
        },
      },
      {
        label: "Stick with your teammates",
        apply: (c) => {
          c.stats.happiness = clamp(c.stats.happiness + 3);
          c.networking = clamp((c.networking ?? 0) + 3);
          return { text: "A fun night with the people you actually like.", tone: "neutral" };
        },
      },
      {
        label: "Skip it",
        apply: (c) => {
          burn(c, -4);
          return {
            text: "An early night. The dinner stories will be secondhand.",
            tone: "neutral",
          };
        },
      },
    ],
  },
  {
    id: "work_conference",
    title: "Conference Invitation",
    description:
      "A respected industry conference accepted your talk proposal — but it's the same week as a big internal deadline.",
    minAge: 20,
    maxAge: 70,
    weight: 3,
    condition: (c) => !!c.job && (c.networking ?? 0) >= 20,
    choices: [
      {
        label: "Give the talk",
        apply: (c) => {
          c.networking = clamp((c.networking ?? 0) + randInt(10, 16));
          if (Math.random() < 0.5) {
            return {
              text: "The talk landed. Recruiters and peers now know your name industry-wide.",
              tone: "milestone",
            };
          }
          c.job!.performance = clamp(c.job!.performance - 4);
          return {
            text: "Great talk — but the missed deadline followed you home.",
            tone: "neutral",
          };
        },
      },
      {
        label: "Stay and hit the deadline",
        apply: (c) => {
          c.job!.performance = clamp(c.job!.performance + 7);
          return {
            text: "Deadline crushed. The conference will run again next year — probably.",
            tone: "good",
          };
        },
      },
    ],
  },
  {
    id: "work_promotion_interview",
    title: "Promotion Interview",
    description:
      "A promotion panel has an open slot. Your manager says you can throw your hat in — if you're ready.",
    minAge: 18,
    maxAge: 70,
    weight: 4,
    condition: (c) => !!c.job && c.job.performance >= 60,
    choices: [
      {
        label: "Go for it",
        apply: (c) => {
          const p = 0.3 + c.job!.performance / 250 + (c.networking ?? 0) / 400;
          if (Math.random() < p) {
            c.job!.performance = clamp(c.job!.performance + 14);
            return {
              text: "You aced the panel. You're now first in line when the promotion cycle lands.",
              tone: "milestone",
            };
          }
          c.stats.happiness = clamp(c.stats.happiness - 3);
          return {
            text: "The panel said 'not yet'. The feedback stung but was specific.",
            tone: "neutral",
          };
        },
      },
      {
        label: "Wait for a stronger case",
        apply: (c) => {
          c.job!.performance = clamp(c.job!.performance + 3);
          return {
            text: "You kept building quietly. Patience is a strategy too.",
            tone: "neutral",
          };
        },
      },
    ],
  },
  {
    id: "work_coworker_conflict",
    title: "Coworker Conflict",
    description:
      "A colleague has been taking credit for your work in meetings. Today they did it in front of the VP.",
    minAge: 16,
    maxAge: 70,
    weight: 4,
    condition: (c) => !!c.job,
    choices: [
      {
        label: "Confront them privately",
        apply: (c) => {
          if (Math.random() < 0.6) {
            c.stats.happiness = clamp(c.stats.happiness + 4);
            return {
              text: "They backed down and publicly credited you the next week. Handled like a pro.",
              tone: "good",
            };
          }
          return { text: "They denied everything. At least the line is drawn.", tone: "neutral" };
        },
      },
      {
        label: "Loop in your manager with receipts",
        apply: (c) => {
          if (Math.random() < 0.55) {
            c.job!.performance = clamp(c.job!.performance + 6);
            return {
              text: "The documentation spoke for itself. Credit restored, quietly.",
              tone: "good",
            };
          }
          c.stats.happiness = clamp(c.stats.happiness - 3);
          return {
            text: "Your manager called it 'a misunderstanding'. Office politics 1, justice 0.",
            tone: "bad",
          };
        },
      },
      {
        label: "Start making your work impossible to steal",
        apply: (c) => {
          c.job!.performance = clamp(c.job!.performance + 4);
          c.networking = clamp((c.networking ?? 0) + 4);
          return {
            text: "You began presenting your own work before anyone else could. Visibility solved it.",
            tone: "good",
          };
        },
      },
    ],
  },
  {
    id: "work_burnout_check",
    title: "Running on Empty",
    description:
      "You've been exhausted for months. Your work is starting to slip and people are noticing.",
    minAge: 18,
    maxAge: 70,
    weight: 6,
    condition: (c) => !!c.job && (c.burnout ?? 0) >= 60,
    choices: [
      {
        label: "Take a real vacation",
        apply: (c) => {
          burn(c, -35);
          c.money -= 3000;
          c.stats.happiness = clamp(c.stats.happiness + 10);
          c.stats.health = clamp(c.stats.health + 4);
          return {
            text: "Two weeks off the grid. You came back a different person — $3,000 lighter, fully recharged.",
            tone: "good",
          };
        },
      },
      {
        label: "Push through",
        apply: (c) => {
          burn(c, 10);
          c.stats.health = clamp(c.stats.health - 6);
          c.job!.performance = clamp(c.job!.performance - 6);
          return { text: "You kept grinding. Your body is keeping score.", tone: "bad" };
        },
      },
      {
        label: "Talk to your manager about workload",
        apply: (c) => {
          if (Math.random() < 0.6) {
            burn(c, -20);
            return {
              text: "Your manager rebalanced the team's load. Honesty worked.",
              tone: "good",
            };
          }
          burn(c, -5);
          return {
            text: "Sympathy, but no real change. Slightly lighter anyway.",
            tone: "neutral",
          };
        },
      },
    ],
  },
];
