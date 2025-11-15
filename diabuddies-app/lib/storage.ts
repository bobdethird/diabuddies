import type { UserProgress, DailyQuest, HealthTask } from "@/types";

/**
 * Default template tasks for daily quest
 */
const DEFAULT_QUEST_TASKS: HealthTask[] = [
  { id: "morning-blood-sugar", title: "Morning Blood Sugar Check", points: 10, completed: false },
  { id: "morning-insulin", title: "Take Morning Insulin", points: 10, completed: false },
  { id: "healthy-breakfast", title: "Eat a Healthy Breakfast", points: 5, completed: false },
  { id: "water-intake", title: "Drink 3 Glasses of Water", points: 5, completed: false },
  { id: "afternoon-blood-sugar", title: "Afternoon Blood Sugar Check", points: 10, completed: false },
  { id: "play-time", title: "10 Minutes of Play Time", points: 5, completed: false },
  { id: "evening-blood-sugar", title: "Evening Blood Sugar Check", points: 10, completed: false },
  { id: "bedtime-blood-sugar", title: "Bedtime Blood Sugar Check", points: 10, completed: false },
];

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("diabuddies_authenticated") === "true";
}

/**
 * Get user name from storage
 */
export function getUserName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("diabuddies_user_name");
}

/**
 * Save user authentication and name
 */
export function saveUserAuth(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("diabuddies_authenticated", "true");
  localStorage.setItem("diabuddies_user_name", name);
}

/**
 * Clear user authentication
 */
export function clearUserAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("diabuddies_authenticated");
  localStorage.removeItem("diabuddies_user_name");
}

/**
 * Get default user progress
 */
export function getUserProgress(): UserProgress {
  return {
    level: 1,
    currentHealth: 0,
    totalHealth: 10,
    totalPoints: 0,
  };
}

/**
 * Save user progress (no-op, storage removed)
 */
export function saveUserProgress(_progress: UserProgress): void {
  // No-op: storage removed
}

/**
 * Get default daily quest
 */
export function getDailyQuest(): DailyQuest {
  return {
    tasks: DEFAULT_QUEST_TASKS.map((task) => ({ ...task })),
    date: getTodayDateString(),
  };
}

/**
 * Save daily quest (no-op, storage removed)
 */
export function saveDailyQuest(_quest: DailyQuest): void {
  // No-op: storage removed
}

/**
 * Reset daily quest (returns default quest)
 */
export function resetDailyQuestIfNeeded(): DailyQuest {
  return getDailyQuest();
}

