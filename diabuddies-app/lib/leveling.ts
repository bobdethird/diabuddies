/**
 * Returns the number of points needed to reach a specific level
 * Level 1: 10 points
 * Level 2: 25 points
 * Level 3: 50 points
 * Level 4+: 100 points per level
 */
export function getPointsForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 10;
  if (level === 2) return 25;
  if (level === 3) return 50;
  // Level 4+ requires 100 points per level
  return 50 + (level - 3) * 100;
}

/**
 * Calculates the total points needed to reach a level
 * Level 1 starts at 0 points, level 2 needs 10, level 3 needs 35, etc.
 */
export function getTotalPointsForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 0; // Level 1 starts at 0 points
  if (level === 2) return 10; // Need 10 points to reach level 2
  if (level === 3) return 35; // Need 35 points to reach level 3 (10 + 25)
  if (level === 4) return 85; // Need 85 points to reach level 4 (10 + 25 + 50)
  
  // Level 5+: 85 + (level - 4) * 100
  return 85 + (level - 4) * 100;
}

/**
 * Calculates the current level based on total points accumulated
 */
export function calculateLevel(totalPoints: number): number {
  if (totalPoints < 10) return 1;
  if (totalPoints < 35) return 2; // 10 + 25
  if (totalPoints < 85) return 3; // 10 + 25 + 50
  
  // Level 4+: (totalPoints - 85) / 100 + 3
  return Math.floor((totalPoints - 85) / 100) + 4;
}

/**
 * Returns the progress percentage (0-100) toward the next level
 */
export function getProgressToNextLevel(totalPoints: number, currentLevel: number): number {
  const currentLevelPoints = getTotalPointsForLevel(currentLevel);
  const nextLevelPoints = getTotalPointsForLevel(currentLevel + 1);
  const pointsNeededForNextLevel = nextLevelPoints - currentLevelPoints;
  const pointsInCurrentLevel = totalPoints - currentLevelPoints;
  
  if (pointsNeededForNextLevel === 0) return 100;
  
  const progress = (pointsInCurrentLevel / pointsNeededForNextLevel) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Returns the points needed to reach the next level
 */
export function getPointsNeededForNextLevel(totalPoints: number, currentLevel: number): number {
  const currentLevelPoints = getTotalPointsForLevel(currentLevel);
  const nextLevelPoints = getTotalPointsForLevel(currentLevel + 1);
  const pointsNeededForNextLevel = nextLevelPoints - currentLevelPoints;
  const pointsInCurrentLevel = totalPoints - currentLevelPoints;
  
  return Math.max(0, pointsNeededForNextLevel - pointsInCurrentLevel);
}

