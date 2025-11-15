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

