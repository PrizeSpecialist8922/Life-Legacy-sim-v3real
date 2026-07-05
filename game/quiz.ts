import type { Character } from "./types";
import { inSchool } from "./education";

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index into options
}

export type QuizCategory =
  | "elementary"
  | "middle"
  | "high"
  | "college"
  | "sat"
  | "act"
  | "lsat"
  | "gmat"
  | "mcat"
  | "bar"
  | "ib_econ"
  | "ib_bio"
  | "ib_science"
  | "ib_math"
  | "ib_history"
  | "ib_cs"
  | "ib_lang"
  | "ib_society"
  | "ib_arts"
  | "comp_debate"
  | "comp_engineering"
  | "comp_finance"
  | "comp_leadership"
  | "comp_sports"
  | "comp_general"
  | "k12_interview";

const BANK: Record<QuizCategory, QuizQuestion[]> = {
  elementary: [
    { q: "What is 7 + 8?", options: ["13", "14", "15", "16"], answer: 2 },
    { q: "What is 6 x 4?", options: ["18", "24", "28", "30"], answer: 1 },
    { q: "Which word is a noun?", options: ["Run", "Happy", "Dog", "Quickly"], answer: 2 },
    { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2 },
    { q: "What planet do we live on?", options: ["Mars", "Earth", "Venus", "Jupiter"], answer: 1 },
    { q: "What is 20 - 9?", options: ["9", "10", "11", "12"], answer: 2 },
    { q: "Which is a mammal?", options: ["Shark", "Frog", "Whale", "Eagle"], answer: 2 },
    {
      q: "Blue and yellow mixed make?",
      options: ["Purple", "Green", "Orange", "Brown"],
      answer: 1,
    },
  ],
  middle: [
    { q: "Solve: 3x = 21. x = ?", options: ["6", "7", "8", "9"], answer: 1 },
    {
      q: "The powerhouse of the cell is the?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Membrane"],
      answer: 2,
    },
    {
      q: "Who was the first U.S. President?",
      options: ["Lincoln", "Jefferson", "Washington", "Adams"],
      answer: 2,
    },
    { q: "What is a synonym of 'rapid'?", options: ["Slow", "Quiet", "Fast", "Heavy"], answer: 2 },
    { q: "What is 12 squared?", options: ["124", "132", "144", "154"], answer: 2 },
    {
      q: "Water is made of hydrogen and?",
      options: ["Nitrogen", "Oxygen", "Carbon", "Helium"],
      answer: 1,
    },
    { q: "Which is a prime number?", options: ["9", "15", "17", "21"], answer: 2 },
    { q: "A triangle's angles add up to?", options: ["90", "180", "270", "360"], answer: 1 },
  ],
  high: [
    {
      q: "In a democracy, ultimate power rests with the?",
      options: ["Military", "People", "Courts", "President"],
      answer: 1,
    },
    {
      q: "Supply rises and demand falls. Price will?",
      options: ["Rise", "Fall", "Stay flat", "Double"],
      answer: 1,
    },
    {
      q: "Area of a circle is?",
      options: ["2 pi r", "pi r squared", "pi d", "r squared"],
      answer: 1,
    },
    {
      q: "Who wrote 'Romeo and Juliet'?",
      options: ["Dickens", "Shakespeare", "Twain", "Poe"],
      answer: 1,
    },
    { q: "The chemical symbol for gold is?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
    {
      q: "A recession is defined by falling?",
      options: ["Inflation", "GDP", "Interest", "Taxes"],
      answer: 1,
    },
    { q: "Solve: x squared = 49. x = ?", options: ["6", "7", "8", "9"], answer: 1 },
    {
      q: "U.S. branches: legislative, judicial, and?",
      options: ["Federal", "Military", "Executive", "State"],
      answer: 2,
    },
  ],
  college: [
    {
      q: "A valid argument with true premises is?",
      options: ["Invalid", "Sound", "Biased", "Circular"],
      answer: 1,
    },
    {
      q: "Compound interest beats simple interest because it?",
      options: ["Ignores time", "Earns on interest", "Lowers principal", "Is untaxed"],
      answer: 1,
    },
    {
      q: "A thesis statement should be?",
      options: ["Vague", "A question", "Arguable", "A quote"],
      answer: 2,
    },
    {
      q: "Correlation does not imply?",
      options: ["Data", "Causation", "Sampling", "Variance"],
      answer: 1,
    },
    {
      q: "Opportunity cost is the value of the?",
      options: ["Cheapest option", "Next best alternative", "Total budget", "Sunk cost"],
      answer: 1,
    },
    {
      q: "A hypothesis must be?",
      options: ["Proven", "Testable", "Popular", "Complex"],
      answer: 1,
    },
    {
      q: "Which strengthens an argument?",
      options: ["Repetition", "A relevant statistic", "Longer sentences", "Bold text"],
      answer: 1,
    },
    {
      q: "Diversification reduces which risk?",
      options: ["Market", "Unsystematic", "Inflation", "Currency"],
      answer: 1,
    },
  ],
  sat: [
    { q: "If 2x + 5 = 17, x = ?", options: ["5", "6", "7", "8"], answer: 1 },
    {
      q: "Best synonym for 'meticulous':",
      options: ["Careless", "Careful", "Loud", "Brief"],
      answer: 1,
    },
    { q: "15% of 200 is?", options: ["25", "30", "35", "40"], answer: 1 },
    {
      q: "Which is grammatically correct?",
      options: ["Their going home", "There going home", "They're going home", "Theyre going home"],
      answer: 2,
    },
    {
      q: "A passage's main idea is its?",
      options: ["Tone", "Central claim", "Diction", "Rhyme"],
      answer: 1,
    },
    {
      q: "A shirt costs $40 after 20% off. Original price?",
      options: ["$48", "$50", "$52", "$60"],
      answer: 1,
    },
    { q: "Antonym of 'expand':", options: ["Grow", "Widen", "Contract", "Extend"], answer: 2 },
    { q: "Slope of y = 3x - 2 is?", options: ["-2", "2", "3", "1"], answer: 2 },
  ],
  act: [
    {
      q: "A car goes 150 miles in 3 hours. Speed?",
      options: ["40 mph", "45 mph", "50 mph", "55 mph"],
      answer: 2,
    },
    {
      q: "Best transition to add contrast:",
      options: ["Therefore", "However", "Moreover", "Thus"],
      answer: 1,
    },
    {
      q: "A control group is used to?",
      options: ["Add variables", "Compare results", "Speed testing", "Reduce cost"],
      answer: 1,
    },
    {
      q: "Which is punctuated correctly?",
      options: ["Its cold out.", "It's cold out.", "Its' cold out.", "It cold's out."],
      answer: 1,
    },
    {
      q: "A line rising left to right shows a trend that is?",
      options: ["Negative", "Flat", "Positive", "None"],
      answer: 2,
    },
    { q: "Square root of 81 = ?", options: ["7", "8", "9", "11"], answer: 2 },
    {
      q: "A reliable experiment must be?",
      options: ["Expensive", "Repeatable", "Long", "Secret"],
      answer: 1,
    },
    {
      q: "Concise revision of 'due to the fact that':",
      options: ["because", "since due", "owing that", "as of"],
      answer: 0,
    },
  ],
  lsat: [
    {
      q: "All roses are flowers. This tulip is a flower. So it's a rose. This is?",
      options: ["Valid", "A fallacy", "Sound", "Certain"],
      answer: 1,
    },
    {
      q: "If it rains, the game is cancelled. It was NOT cancelled. So?",
      options: ["It rained", "It did not rain", "Unknown", "It snowed"],
      answer: 1,
    },
    {
      q: "Which weakens 'Coffee causes productivity'?",
      options: [
        "Coffee tastes good",
        "Productive people drink it for other reasons",
        "Coffee is popular",
        "Coffee is warm",
      ],
      answer: 1,
    },
    {
      q: "A necessary condition for X is one X?",
      options: ["Guarantees", "Cannot occur without", "Prevents", "Follows"],
      answer: 1,
    },
    {
      q: "Only members may vote. Sam voted. So Sam?",
      options: ["Is not a member", "Is a member", "Might be a member", "Is an officer"],
      answer: 1,
    },
    {
      q: "Assumption in 'Ban ads; they lower sales'?",
      options: ["Ads are cheap", "Lower sales are undesirable", "Sales are high", "Ads are common"],
      answer: 1,
    },
    { q: "Sequence: 2, 4, 8, 16, ?", options: ["24", "30", "32", "20"], answer: 2 },
    {
      q: "If some A are B, it must be true that?",
      options: ["All A are B", "Some B are A", "No A are B", "All B are A"],
      answer: 1,
    },
  ],
  gmat: [
    {
      q: "Revenue $500k, costs $350k. Profit margin?",
      options: ["20%", "30%", "35%", "40%"],
      answer: 1,
    },
    { q: "If x/4 = 9, x = ?", options: ["27", "32", "36", "40"], answer: 2 },
    {
      q: "Which strengthens 'raise prices to boost profit'?",
      options: [
        "Demand is inelastic",
        "Competitors are cheaper",
        "Costs rose",
        "Customers are price-sensitive",
      ],
      answer: 0,
    },
    {
      q: "Sales doubling yearly is growth that is?",
      options: ["Linear", "Exponential", "Flat", "Negative"],
      answer: 1,
    },
    { q: "20 is what percent of 80?", options: ["20%", "25%", "30%", "40%"], answer: 1 },
    {
      q: "To find a square's area you need?",
      options: ["Its color", "One side length", "Two sides", "The diagonal only"],
      answer: 1,
    },
    {
      q: "Rising costs with flat revenue means profit?",
      options: ["Rises", "Falls", "Flat", "Doubles"],
      answer: 1,
    },
    { q: "Average of 10, 20, 30 is?", options: ["15", "20", "25", "30"], answer: 1 },
  ],
  mcat: [
    {
      q: "DNA is composed of units called?",
      options: ["Amino acids", "Nucleotides", "Lipids", "Sugars"],
      answer: 1,
    },
    { q: "The pH of a neutral solution is?", options: ["0", "7", "10", "14"], answer: 1 },
    {
      q: "Which organ produces insulin?",
      options: ["Liver", "Kidney", "Pancreas", "Spleen"],
      answer: 2,
    },
    {
      q: "Enzymes are primarily made of?",
      options: ["Carbohydrates", "Proteins", "Fats", "Minerals"],
      answer: 1,
    },
    {
      q: "An acid donates?",
      options: ["Electrons", "Protons (H+)", "Neutrons", "Oxygen"],
      answer: 1,
    },
    {
      q: "The variable a scientist changes is the?",
      options: ["Dependent variable", "Independent variable", "Control", "Constant"],
      answer: 1,
    },
    {
      q: "Red blood cells carry oxygen using?",
      options: ["Insulin", "Hemoglobin", "Collagen", "Keratin"],
      answer: 1,
    },
    {
      q: "Cellular respiration mainly produces?",
      options: ["DNA", "ATP", "Glucose", "Oxygen"],
      answer: 1,
    },
  ],
  bar: [
    {
      q: "A contract requires offer, acceptance, and?",
      options: ["Notary", "Consideration", "Witnesses", "Payment"],
      answer: 1,
    },
    {
      q: "Burden of proof in a criminal case is?",
      options: ["Preponderance", "Beyond reasonable doubt", "Probable cause", "Clear intent"],
      answer: 1,
    },
    {
      q: "Which amendment protects against self-incrimination?",
      options: ["First", "Fourth", "Fifth", "Tenth"],
      answer: 2,
    },
    {
      q: "Confidentiality is owed to the?",
      options: ["Court", "Client", "Public", "Opposing counsel"],
      answer: 1,
    },
    {
      q: "Judicial review was established in?",
      options: ["Roe v. Wade", "Marbury v. Madison", "Brown v. Board", "Miranda v. Arizona"],
      answer: 1,
    },
    {
      q: "A tort is a?",
      options: ["Criminal charge", "Civil wrong", "Contract term", "Tax form"],
      answer: 1,
    },
    {
      q: "A lawyer must avoid a conflict of?",
      options: ["Schedule", "Interest", "Opinion", "Venue"],
      answer: 1,
    },
    {
      q: "Due process is in the 5th and which amendment?",
      options: ["10th", "14th", "2nd", "8th"],
      answer: 1,
    },
  ],
  ib_econ: [
    {
      q: "If supply falls and demand is unchanged, price will?",
      options: ["Fall", "Rise", "Stay flat", "Hit zero"],
      answer: 1,
    },
    {
      q: "Inflation is a sustained rise in?",
      options: ["Wages", "The general price level", "Exports", "Taxes"],
      answer: 1,
    },
    {
      q: "GDP measures a country's total?",
      options: ["Debt", "Output of goods & services", "Population", "Money supply"],
      answer: 1,
    },
    {
      q: "Opportunity cost is the value of the?",
      options: ["Cheapest good", "Next best alternative forgone", "Total budget", "Imported goods"],
      answer: 1,
    },
    {
      q: "A price ceiling below equilibrium causes?",
      options: ["Surplus", "Shortage", "No change", "Deflation"],
      answer: 1,
    },
    {
      q: "Elastic demand means quantity responds strongly to?",
      options: ["Weather", "Price changes", "Advertising", "Population"],
      answer: 1,
    },
  ],
  ib_bio: [
    {
      q: "The basic unit of life is the?",
      options: ["Atom", "Cell", "Organ", "Tissue"],
      answer: 1,
    },
    { q: "Genes are made of?", options: ["Protein", "DNA", "Lipids", "Starch"], answer: 1 },
    {
      q: "Natural selection favors traits that improve?",
      options: ["Size", "Survival & reproduction", "Speed only", "Color"],
      answer: 1,
    },
    {
      q: "Photosynthesis converts light energy into?",
      options: ["Heat", "Chemical energy (glucose)", "Motion", "Sound"],
      answer: 1,
    },
    {
      q: "Mitosis produces cells that are?",
      options: ["Genetically identical", "Haploid", "Random", "Larger"],
      answer: 0,
    },
    {
      q: "Enzymes speed up reactions by lowering?",
      options: ["Temperature", "Activation energy", "pH", "Mass"],
      answer: 1,
    },
  ],
  ib_science: [
    { q: "The chemical symbol for sodium is?", options: ["So", "Na", "Sd", "N"], answer: 1 },
    {
      q: "Force equals mass times?",
      options: ["Velocity", "Acceleration", "Distance", "Time"],
      answer: 1,
    },
    {
      q: "An exothermic reaction releases?",
      options: ["Light only", "Heat", "Electrons", "Mass"],
      answer: 1,
    },
    { q: "Current is measured in?", options: ["Volts", "Amperes", "Ohms", "Watts"], answer: 1 },
    {
      q: "The pH of an acid is?",
      options: ["Above 7", "Below 7", "Exactly 7", "Zero always"],
      answer: 1,
    },
    {
      q: "Energy cannot be created or destroyed \u2014 this is conservation of?",
      options: ["Mass", "Energy", "Charge", "Momentum"],
      answer: 1,
    },
  ],
  ib_math: [
    { q: "If f(x) = 2x + 3, f(4) = ?", options: ["9", "10", "11", "12"], answer: 2 },
    {
      q: "Solve: x\u00b2 - 9 = 0",
      options: ["x = 3 only", "x = \u00b13", "x = 9", "x = -9"],
      answer: 1,
    },
    {
      q: "The probability of two independent events both occurring is their?",
      options: ["Sum", "Product", "Difference", "Average"],
      answer: 1,
    },
    { q: "The gradient of y = 5x - 7 is?", options: ["-7", "5", "7", "0"], answer: 1 },
    { q: "log\u2081\u2080(1000) = ?", options: ["2", "3", "10", "100"], answer: 1 },
    {
      q: "A function maps each input to how many outputs?",
      options: ["Exactly one", "Two", "Any number", "Zero"],
      answer: 0,
    },
  ],
  ib_history: [
    {
      q: "A primary source is one created?",
      options: [
        "By historians later",
        "At the time of the event",
        "For textbooks",
        "By governments only",
      ],
      answer: 1,
    },
    { q: "World War I began in?", options: ["1912", "1914", "1918", "1939"], answer: 1 },
    {
      q: "The Cold War was primarily between the USA and?",
      options: ["Germany", "The Soviet Union", "Japan", "China"],
      answer: 1,
    },
    {
      q: "Appeasement in the 1930s aimed to avoid war by?",
      options: [
        "Building alliances",
        "Conceding to demands",
        "Blockades",
        "Disarmament treaties only",
      ],
      answer: 1,
    },
    {
      q: "Historians weigh a source's origin, purpose, and?",
      options: ["Length", "Content & limitations", "Language", "Age of author"],
      answer: 1,
    },
    {
      q: "The Treaty of Versailles ended?",
      options: ["WWII", "WWI", "The Cold War", "The Napoleonic Wars"],
      answer: 1,
    },
  ],
  ib_cs: [
    {
      q: "An algorithm is a?",
      options: ["Programming language", "Step-by-step procedure", "Type of computer", "Data file"],
      answer: 1,
    },
    {
      q: "Binary search requires the data to be?",
      options: ["Random", "Sorted", "Numeric only", "Small"],
      answer: 1,
    },
    {
      q: "A loop that never ends is called?",
      options: ["A recursion", "An infinite loop", "A branch", "A stack"],
      answer: 1,
    },
    {
      q: "Which structure is LIFO (last in, first out)?",
      options: ["Queue", "Stack", "Array", "Graph"],
      answer: 1,
    },
    {
      q: "A variable stores?",
      options: ["Hardware", "A value", "The compiler", "The screen"],
      answer: 1,
    },
    {
      q: "Big-O notation describes an algorithm's?",
      options: ["Author", "Growth of cost with input size", "Language", "Bug count"],
      answer: 1,
    },
  ],
  ib_lang: [
    {
      q: "A metaphor compares two things without using?",
      options: ["Verbs", "'Like' or 'as'", "Nouns", "Punctuation"],
      answer: 1,
    },
    {
      q: "The narrator's attitude toward the subject is the?",
      options: ["Plot", "Tone", "Setting", "Theme"],
      answer: 1,
    },
    {
      q: "An unreliable narrator is one whose account?",
      options: ["Rhymes", "Cannot be fully trusted", "Is in third person", "Is historical"],
      answer: 1,
    },
    {
      q: "Juxtaposition places two elements together to?",
      options: ["Save space", "Highlight contrast", "End a scene", "Add rhyme"],
      answer: 1,
    },
    {
      q: "The central message of a literary work is its?",
      options: ["Genre", "Theme", "Climax", "Diction"],
      answer: 1,
    },
    {
      q: "Persuasive texts primarily aim to?",
      options: ["Entertain", "Convince the audience", "Rhyme", "Describe weather"],
      answer: 1,
    },
  ],
  ib_society: [
    {
      q: "In psychology, a variable manipulated by researchers is the?",
      options: ["Dependent", "Independent", "Control", "Random"],
      answer: 1,
    },
    {
      q: "Globalization increases the movement of goods, people and?",
      options: ["Weather", "Ideas & capital", "Continents", "Time zones"],
      answer: 1,
    },
    {
      q: "A market with a single seller is a?",
      options: ["Duopoly", "Monopoly", "Oligopoly", "Commons"],
      answer: 1,
    },
    {
      q: "Sovereignty means a state's authority to?",
      options: ["Trade freely", "Govern itself", "Print maps", "Join alliances"],
      answer: 1,
    },
    {
      q: "Push factors in migration include?",
      options: [
        "Better wages abroad",
        "Conflict or hardship at home",
        "Family reunification",
        "Tourism",
      ],
      answer: 1,
    },
    {
      q: "Utilitarian ethics judges actions by their?",
      options: ["Intentions", "Consequences for wellbeing", "Legality", "Tradition"],
      answer: 1,
    },
  ],
  ib_arts: [
    {
      q: "The arrangement of visual elements in art is called?",
      options: ["Palette", "Composition", "Medium", "Gallery"],
      answer: 1,
    },
    {
      q: "In music, tempo refers to?",
      options: ["Volume", "Speed", "Pitch", "Harmony"],
      answer: 1,
    },
    {
      q: "In theatre, blocking refers to?",
      options: ["Lighting cues", "Actors' movement on stage", "Ticket sales", "Costume design"],
      answer: 1,
    },
    {
      q: "A film shot from high above the subject is a?",
      options: ["Close-up", "Bird's-eye/high-angle shot", "Dolly zoom", "Cutaway"],
      answer: 1,
    },
    {
      q: "Complementary colors sit where on the color wheel?",
      options: ["Adjacent", "Opposite", "Center", "Random"],
      answer: 1,
    },
    {
      q: "A motif is a(n)?",
      options: ["One-off effect", "Recurring element or idea", "Type of brush", "Stage exit"],
      answer: 1,
    },
  ],
  comp_debate: [
    {
      q: "Your opponent attacks you instead of your argument. This fallacy is?",
      options: ["Straw man", "Ad hominem", "Red herring", "Slippery slope"],
      answer: 1,
    },
    {
      q: "The strongest rebuttal targets the opponent's?",
      options: ["Tone", "Core assumption", "Appearance", "Time usage"],
      answer: 1,
    },
    {
      q: "Misrepresenting an argument to defeat it easily is a?",
      options: ["Straw man", "Tautology", "Syllogism", "Dilemma"],
      answer: 0,
    },
    {
      q: "Evidence from a peer-reviewed study is best described as?",
      options: ["Anecdotal", "Empirical", "Hypothetical", "Rhetorical"],
      answer: 1,
    },
    {
      q: "In a debate, the burden of proof rests with the side that?",
      options: ["Speaks last", "Makes the claim", "Is negative", "Has less time"],
      answer: 1,
    },
    {
      q: "'Everyone believes it, so it's true' is the fallacy of?",
      options: ["Bandwagon", "False cause", "Equivocation", "Circular reasoning"],
      answer: 0,
    },
  ],
  comp_engineering: [
    {
      q: "A truss bridge distributes load primarily through?",
      options: ["Bending", "Triangulated tension & compression", "Friction", "Magnetism"],
      answer: 1,
    },
    {
      q: "In robotics, a sensor's job is to?",
      options: ["Move parts", "Gather information", "Store power", "Cool motors"],
      answer: 1,
    },
    {
      q: "Gear ratios trade speed for?",
      options: ["Color", "Torque", "Voltage", "Weight"],
      answer: 1,
    },
    {
      q: "A prototype's main purpose is to?",
      options: ["Impress judges", "Test ideas quickly", "Replace testing", "Save paint"],
      answer: 1,
    },
    {
      q: "Debugging a robot starts with?",
      options: [
        "Rebuilding it",
        "Isolating the failing subsystem",
        "Buying new parts",
        "Repainting",
      ],
      answer: 1,
    },
    {
      q: "Redundancy in a design improves?",
      options: ["Reliability", "Weight", "Cost", "Noise"],
      answer: 0,
    },
  ],
  comp_finance: [
    {
      q: "A stock's P/E ratio compares price to?",
      options: ["Equity", "Earnings", "Employees", "Expenses"],
      answer: 1,
    },
    {
      q: "Diversification primarily reduces?",
      options: ["Returns", "Company-specific risk", "Taxes", "Fees"],
      answer: 1,
    },
    {
      q: "A company with rising revenue but falling margins has a problem with?",
      options: ["Demand", "Costs", "Branding", "Location"],
      answer: 1,
    },
    {
      q: "In a stock pitch, your thesis should state?",
      options: [
        "The CEO's name",
        "Why the market is mispricing it",
        "The office address",
        "The logo colors",
      ],
      answer: 1,
    },
    {
      q: "Compound growth means returns are earned on?",
      options: ["Principal only", "Principal plus prior returns", "Dividends only", "Fees"],
      answer: 1,
    },
    {
      q: "A moat refers to a company's?",
      options: ["Debt", "Durable competitive advantage", "Headquarters", "Stock price"],
      answer: 1,
    },
  ],
  comp_leadership: [
    {
      q: "The best campaign promise is one that is?",
      options: ["Vague", "Specific and achievable", "Expensive", "Secret"],
      answer: 1,
    },
    {
      q: "When two club members conflict, a leader should first?",
      options: ["Pick the popular one", "Hear both sides", "Ignore it", "Vote them out"],
      answer: 1,
    },
    {
      q: "Delegation works best when tasks match members'?",
      options: ["Friendships", "Strengths", "Grade level", "Height"],
      answer: 1,
    },
    {
      q: "A persuasive speech opens with?",
      options: ["An apology", "A hook the audience cares about", "Statistics only", "Thank-yous"],
      answer: 1,
    },
    {
      q: "Losing a vote gracefully builds?",
      options: ["Nothing", "Credibility for next time", "Enemies", "Debt"],
      answer: 1,
    },
    {
      q: "A budget proposal should prioritize?",
      options: ["Personal perks", "Impact per dollar", "Longest events", "New logos"],
      answer: 1,
    },
  ],
  comp_sports: [
    {
      q: "Down late in the game, the smart play is to?",
      options: ["Panic", "Run your practiced set plays", "Argue with refs", "Slow down"],
      answer: 1,
    },
    {
      q: "The best response to a faster opponent is?",
      options: ["Complain", "Positioning and anticipation", "Fouling", "Giving up"],
      answer: 1,
    },
    {
      q: "Proper recovery after intense training requires?",
      options: ["No sleep", "Rest and hydration", "More sprints", "Skipping meals"],
      answer: 1,
    },
    {
      q: "A captain's job during a losing streak is to?",
      options: ["Blame teammates", "Steady the team's focus", "Skip practice", "Change sports"],
      answer: 1,
    },
    {
      q: "Playing through a serious injury usually?",
      options: ["Heals it", "Makes it worse", "Has no effect", "Impresses scouts safely"],
      answer: 1,
    },
    {
      q: "Film study before a championship helps you?",
      options: ["Relax", "Exploit opponent tendencies", "Avoid warm-ups", "Sell tickets"],
      answer: 1,
    },
  ],
  comp_general: [
    {
      q: "Consistent practice beats cramming because skills need?",
      options: ["Luck", "Repetition over time", "Expensive gear", "An audience"],
      answer: 1,
    },
    {
      q: "Before a competition, the most useful preparation is?",
      options: [
        "Predicting the format and practicing it",
        "Buying merch",
        "Trash talk",
        "All-nighters",
      ],
      answer: 0,
    },
    {
      q: "When you hit a hard problem mid-competition, you should?",
      options: ["Freeze", "Bank it and return later", "Guess instantly", "Quit"],
      answer: 1,
    },
    {
      q: "Teams outperform individuals when they?",
      options: ["Argue often", "Divide roles clearly", "Share one job", "Skip planning"],
      answer: 1,
    },
    {
      q: "Losing a close final is most valuable as?",
      options: ["Proof to quit", "Feedback for next season", "Bad luck", "A secret"],
      answer: 1,
    },
    {
      q: "Nerves before competing are best handled by?",
      options: ["Avoiding the event", "Routine and breathing", "Caffeine only", "Silence"],
      answer: 1,
    },
  ],
  k12_interview: [
    {
      q: "The admissions panel asks why you want to attend. The strongest answer mentions?",
      options: [
        "The uniform",
        "Specific programs that match your goals",
        "Your parents made you",
        "Shorter commute",
      ],
      answer: 1,
    },
    {
      q: "Asked about a weakness, you should?",
      options: [
        "Claim you have none",
        "Name one and how you're improving it",
        "Blame teachers",
        "Change the subject",
      ],
      answer: 1,
    },
    {
      q: "Asked about a book you enjoyed, the best answer?",
      options: [
        "'I don't read'",
        "Names one and what it made you think",
        "Lists ten titles",
        "Mentions a movie",
      ],
      answer: 1,
    },
    {
      q: "When you don't know an answer, you should?",
      options: [
        "Make something up",
        "Say so and reason through it aloud",
        "Stay silent",
        "Ask to leave",
      ],
      answer: 1,
    },
    {
      q: "Good questions to ask the interviewer are about?",
      options: ["Salary", "Student life and opportunities", "Nothing", "Their age"],
      answer: 1,
    },
    {
      q: "Arriving at an interview, you should be?",
      options: ["Fashionably late", "Early and prepared", "With friends", "On your phone"],
      answer: 1,
    },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build a randomized quiz of `count` questions from a category. */
export function buildQuiz(category: QuizCategory, count: number): QuizQuestion[] {
  return shuffle(BANK[category]).slice(0, Math.min(count, BANK[category].length));
}

/** The assignment category appropriate for the player's current stage. */
export function assignmentCategory(c: Character): QuizCategory {
  if (!inSchool(c)) return "high";
  if (c.education === "college") return "college";
  if (c.education === "high") return "high";
  if (c.education === "middle") return "middle";
  return "elementary";
}
