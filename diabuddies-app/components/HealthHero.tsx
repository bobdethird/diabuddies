"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getProgressToNextLevel,
  getPointsNeededForNextLevel,
} from "@/lib/leveling";
import type { UserProgress } from "@/types";

interface HealthHeroProps {
  progress: UserProgress;
}

/**
 * Get hero emoji based on level
 * Hero evolves as level increases
 */
function getHeroEmoji(level: number): string {
  if (level >= 10) return "💎";
  if (level >= 7) return "🔴";
  if (level >= 4) return "🟠";
  if (level >= 2) return "🟡";
  return "🟢";
}

export function HealthHero({ progress }: HealthHeroProps) {
  const progressPercent = getProgressToNextLevel(
    progress.totalPoints,
    progress.level
  );
  const pointsNeeded = getPointsNeededForNextLevel(
    progress.totalPoints,
    progress.level
  );

  const heroEmoji = getHeroEmoji(progress.level);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Health Hero</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Hero Character */}
        <div className="text-8xl">{heroEmoji}</div>

        {/* Level Badge */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-muted-foreground">Level</div>
          <div className="text-4xl font-bold"> {progress.level}</div>
        </div>

        {/* Health Bar */}
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Next Level</span>
            <span className="font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <div className="text-center text-sm text-muted-foreground">
            {pointsNeeded} points to level {progress.level + 1}
          </div>
        </div>

        {/* Total Points */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Total Points</div>
          <div className="text-2xl font-semibold">{progress.totalPoints}</div>
        </div>
      </CardContent>
    </Card>
  );
}

