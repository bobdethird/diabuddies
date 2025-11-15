import type { UserProgress, DailyQuest, HealthTask } from "@/types";

const STORAGE_KEYS = {
  USER_PROGRESS: "diabuddies_user_progress",
  DAILY_QUEST: "diabuddies_daily_quest",
  QUEST_DATE: "diabuddies_quest_date",
} as const;

/**
 * Default template tasks for daily quest
 */
const DEFAULT_QUEST_TASKS: HealthTask[] = [
  { id: "1", title: "Take morning insulin", points: 10, completed: false },
  { id: "2", title: "Eat healthy breakfast", points: 5, completed: false },
  { id: "3", title: "Drink 3 glasses of water", points: 5, completed: false },
];

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Check if we need to reset the daily quest (new day)
 */
function isNewDay(): boolean {
  if (typeof window === "undefined") return false;
  
  const savedDate = localStorage.getItem(STORAGE_KEYS.QUEST_DATE);
  const today = getTodayDateString();
  
  return savedDate !== today;
}

/**
 * Get user progress from localStorage
 */
export function getUserProgress(): UserProgress {
  if (typeof window === "undefined") {
    return {
      level: 1,
      currentHealth: 0,
      totalHealth: 10,
      totalPoints: 0,
    };
  }

  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
  if (!stored) {
    return {
      level: 1,
      currentHealth: 0,
      totalHealth: 10,
      totalPoints: 0,
    };
  }

  try {
    return JSON.parse(stored) as UserProgress;
  } catch {
    return {
      level: 1,
      currentHealth: 0,
      totalHealth: 10,
      totalPoints: 0,
    };
  }
}

/**
 * Save user progress to localStorage
 */
export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
}

/**
 * Get daily quest from localStorage
 */
export function getDailyQuest(): DailyQuest {
  if (typeof window === "undefined") {
    return {
      tasks: DEFAULT_QUEST_TASKS.map((task) => ({ ...task })),
      date: getTodayDateString(),
    };
  }

  // Check if we need to reset for a new day
  if (isNewDay()) {
    const newQuest: DailyQuest = {
      tasks: DEFAULT_QUEST_TASKS.map((task) => ({ ...task })),
      date: getTodayDateString(),
    };
    saveDailyQuest(newQuest);
    return newQuest;
  }

  const stored = localStorage.getItem(STORAGE_KEYS.DAILY_QUEST);
  if (!stored) {
    const newQuest: DailyQuest = {
      tasks: DEFAULT_QUEST_TASKS.map((task) => ({ ...task })),
      date: getTodayDateString(),
    };
    saveDailyQuest(newQuest);
    return newQuest;
  }

  try {
    return JSON.parse(stored) as DailyQuest;
  } catch {
    const newQuest: DailyQuest = {
      tasks: DEFAULT_QUEST_TASKS.map((task) => ({ ...task })),
      date: getTodayDateString(),
    };
    saveDailyQuest(newQuest);
    return newQuest;
  }
}

/**
 * Save daily quest to localStorage
 */
export function saveDailyQuest(quest: DailyQuest): void {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(STORAGE_KEYS.DAILY_QUEST, JSON.stringify(quest));
  localStorage.setItem(STORAGE_KEYS.QUEST_DATE, quest.date);
}

/**
 * Reset daily quest if needed (checks for new day)
 */
export function resetDailyQuestIfNeeded(): DailyQuest {
  if (isNewDay()) {
    const newQuest: DailyQuest = {
      tasks: DEFAULT_QUEST_TASKS.map((task) => ({ ...task })),
      date: getTodayDateString(),
    };
    saveDailyQuest(newQuest);
    return newQuest;
  }
  
  return getDailyQuest();
}

