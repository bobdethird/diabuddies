"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
 * Get hero evolution image based on level
 * Level 1: First evolution (0-9 points)
 * Level 2: Second evolution (10-34 points)
 * Level 3: Third evolution (35-84 points)
 * Level 4+: Fourth evolution (85+ points)
 */
function getHeroEvolution(level: number): string {
  if (level >= 4) return "/fourth evolution.png";
  if (level >= 3) return "/third evolution.png";
  if (level >= 2) return "/second evolution.png";
  return "/first evolution.png";
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

  const heroImage = getHeroEvolution(progress.level);
  const [isVisible, setIsVisible] = useState(true);
  const [currentImage, setCurrentImage] = useState(heroImage);

  // Smooth transition when evolution changes
  useEffect(() => {
    if (currentImage !== heroImage) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentImage(heroImage);
        setIsVisible(true);
      }, 300);
    }
  }, [heroImage, currentImage]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Health Hero</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Hero Character with Animation */}
        <div className="relative h-[200px] w-[200px] flex items-center justify-center">
          <div className="animate-bounce-slow relative">
            <Image
              src={currentImage}
              alt="Health Hero"
              width={200}
              height={200}
              className={`drop-shadow-2xl transition-all duration-500 hover:scale-110 animate-pulse-gentle ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              priority
            />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-primary/10 to-transparent rounded-full blur-2xl animate-pulse-slow -z-10" />
            {/* Sparkle effect for higher levels */}
            {progress.level >= 3 && (
              <div className="absolute inset-0 animate-sparkle">
                <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-400 rounded-full opacity-75" />
                <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-60" />
                <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-70" />
              </div>
            )}
          </div>
        </div>

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

