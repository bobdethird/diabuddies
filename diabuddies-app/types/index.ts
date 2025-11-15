export interface UserProgress {
  level: number;
  currentHealth: number;
  totalHealth: number;
  totalPoints: number;
}

export interface HealthTask {
  id: string;
  title: string;
  points: number;
  completed: boolean;
}

export interface DailyQuest {
  tasks: HealthTask[];
  date: string; // ISO date string for tracking when quest was created
}

export interface DetailedInsight {
  title: string;
  userValue: string; // The actual stat from PDF
  referenceValue: string; // Normal range or average
  isGood: boolean; // Whether the stat is good or needs attention
  explanation: string; // Simple explanation (what's good/bad)
  action: string; // What to do
  simpleExplanation: string; // Why it matters, child-friendly
}

