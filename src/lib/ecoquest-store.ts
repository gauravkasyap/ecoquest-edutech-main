import { useSyncExternalStore } from "react";

export type Mission = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  points: number;
  category: "water" | "waste" | "plants" | "energy" | "community";
};

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirement: number; // points required
};

export type Quiz = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  points: number;
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  school: string;
  points: number;
  avatar: string;
  isMe?: boolean;
};

export type PlayerState = {
  name: string;
  school: string;
  points: number;
  completedMissions: string[];
  completedQuizzes: string[];
  treesPlanted: number;
};

const STORAGE_KEY = "ecoquest:v1";

const defaultPlayer: PlayerState = {
  name: "Eco Explorer",
  school: "Green Valley School",
  points: 0,
  completedMissions: [],
  completedQuizzes: [],
  treesPlanted: 0,
};

let state: PlayerState = defaultPlayer;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...defaultPlayer, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function setState(updater: (s: PlayerState) => PlayerState) {
  state = updater(state);
  persist();
  emit();
}

let loaded = false;
function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    load();
    loaded = true;
  }
}

export function usePlayer(): PlayerState {
  ensureLoaded();
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => defaultPlayer,
  );
}

export function completeMission(mission: Mission) {
  setState((s) => {
    if (s.completedMissions.includes(mission.id)) return s;
    const treesBonus = mission.category === "plants" ? 1 : 0;
    return {
      ...s,
      points: s.points + mission.points,
      completedMissions: [...s.completedMissions, mission.id],
      treesPlanted: s.treesPlanted + treesBonus,
    };
  });
}

export function completeQuiz(quiz: Quiz, correct: boolean) {
  setState((s) => {
    if (s.completedQuizzes.includes(quiz.id)) return s;
    return {
      ...s,
      points: s.points + (correct ? quiz.points : 0),
      completedQuizzes: [...s.completedQuizzes, quiz.id],
    };
  });
}

export function updateProfile(name: string, school: string) {
  setState((s) => ({ ...s, name, school }));
}

export function resetProgress() {
  setState(() => ({ ...defaultPlayer }));
}

// ============ Seed Data ============

export const MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "Plant a Sapling",
    description: "Plant a small tree at home or school and water it.",
    emoji: "🌱",
    points: 50,
    category: "plants",
  },
  {
    id: "m2",
    title: "Sort the Waste",
    description: "Separate dry, wet, and recyclable waste for a whole day.",
    emoji: "♻️",
    points: 30,
    category: "waste",
  },
  {
    id: "m3",
    title: "Save Water Hero",
    description: "Turn off the tap while brushing — save 10 litres today.",
    emoji: "💧",
    points: 20,
    category: "water",
  },
  {
    id: "m4",
    title: "Lights Off Challenge",
    description: "Switch off all unused lights and fans for one day.",
    emoji: "💡",
    points: 25,
    category: "energy",
  },
  {
    id: "m5",
    title: "Plastic-Free Lunch",
    description: "Pack lunch in a reusable box with no plastic wraps.",
    emoji: "🥗",
    points: 30,
    category: "waste",
  },
  {
    id: "m6",
    title: "Bird Feeder",
    description: "Make a simple bird feeder and hang it outside.",
    emoji: "🐦",
    points: 35,
    category: "community",
  },
  {
    id: "m7",
    title: "Walk Don't Ride",
    description: "Walk or cycle instead of taking a vehicle for short trips.",
    emoji: "🚲",
    points: 25,
    category: "energy",
  },
  {
    id: "m8",
    title: "Plant a Flower",
    description: "Plant flowers to help bees and butterflies.",
    emoji: "🌻",
    points: 40,
    category: "plants",
  },
  {
    id: "m9",
    title: "Clean the Park",
    description: "Spend 30 minutes picking up litter at a nearby park.",
    emoji: "🧹",
    points: 45,
    category: "community",
  },
  {
    id: "m10",
    title: "Compost Starter",
    description: "Start a small compost bin from kitchen scraps.",
    emoji: "🪱",
    points: 35,
    category: "waste",
  },
];

export const BADGES: Badge[] = [
  {
    id: "b1",
    name: "Seedling",
    emoji: "🌱",
    description: "Earn your first 50 Eco Points",
    requirement: 50,
  },
  { id: "b2", name: "Sprout", emoji: "🌿", description: "Reach 150 Eco Points", requirement: 150 },
  { id: "b3", name: "Sapling", emoji: "🌳", description: "Reach 300 Eco Points", requirement: 300 },
  {
    id: "b4",
    name: "Forest Guardian",
    emoji: "🌲",
    description: "Reach 500 Eco Points",
    requirement: 500,
  },
  {
    id: "b5",
    name: "Eco Champion",
    emoji: "🏆",
    description: "Reach 750 Eco Points",
    requirement: 750,
  },
  {
    id: "b6",
    name: "Planet Hero",
    emoji: "🌍",
    description: "Reach 1000 Eco Points",
    requirement: 1000,
  },
];

export const QUIZZES: Quiz[] = [
  {
    id: "q1",
    question: "Which of these helps save water at home?",
    options: [
      "Leaving the tap running",
      "Turning off tap while brushing",
      "Using only hot water",
      "Filling the sink to the top",
    ],
    answerIndex: 1,
    explanation: "Turning off the tap while brushing can save up to 10 litres of water per day!",
    points: 15,
  },
  {
    id: "q2",
    question: "What goes into a compost bin?",
    options: ["Plastic bottles", "Banana peels and veggie scraps", "Glass jars", "Metal cans"],
    answerIndex: 1,
    explanation: "Fruit peels and veggie scraps break down into rich soil for plants.",
    points: 15,
  },
  {
    id: "q3",
    question: "Why are trees important?",
    options: [
      "They make noise",
      "They give oxygen and shade",
      "They block roads",
      "They use electricity",
    ],
    answerIndex: 1,
    explanation: "Trees give us oxygen, shade, food, and a home for animals.",
    points: 15,
  },
  {
    id: "q4",
    question: "Which item is recyclable?",
    options: ["Used tissue", "Plastic bottle", "Food waste", "Broken light bulb"],
    answerIndex: 1,
    explanation: "Plastic bottles can be cleaned and recycled into new products.",
    points: 15,
  },
  {
    id: "q5",
    question: "What is the best way to save electricity?",
    options: [
      "Leave fans on all day",
      "Switch off unused lights",
      "Open the fridge often",
      "Charge phones overnight",
    ],
    answerIndex: 1,
    explanation: "Switching off unused lights saves energy and reduces pollution.",
    points: 15,
  },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { id: "u1", name: "Aarav S.", school: "Green Valley School", points: 820, avatar: "🦊" },
  { id: "u2", name: "Meera K.", school: "Sunrise Public", points: 760, avatar: "🐼" },
  { id: "u3", name: "Rohan T.", school: "Green Valley School", points: 690, avatar: "🦉" },
  { id: "u4", name: "Diya P.", school: "Eco International", points: 640, avatar: "🐨" },
  { id: "u5", name: "Kabir M.", school: "Sunrise Public", points: 580, avatar: "🐯" },
  { id: "u6", name: "Anaya R.", school: "Green Valley School", points: 510, avatar: "🦄" },
  { id: "u7", name: "Vivaan L.", school: "Eco International", points: 470, avatar: "🐵" },
  { id: "u8", name: "Saanvi N.", school: "Sunrise Public", points: 410, avatar: "🐰" },
];
