"use client";

import { useEffect, useState } from "react";
import { HealthHero } from "@/components/HealthHero";
import { QuestList } from "@/components/QuestList";
import { PointsCounter } from "@/components/PointsCounter";
import {
  getUserProgress,
  saveUserProgress,
  getDailyQuest,
  saveDailyQuest,
  resetDailyQuestIfNeeded,
} from "@/lib/storage";
import { calculateLevel } from "@/lib/leveling";
import type { UserProgress, HealthTask } from "@/types";

export default function Home() {
  const [progress, setProgress] = useState<UserProgress>(() =>
    getUserProgress()
  );
  const [quest, setQuest] = useState<HealthTask[]>(() => {
    const dailyQuest = getDailyQuest();
    return dailyQuest.tasks;
  });

  // Reset quest if new day on mount
  useEffect(() => {
    const updatedQuest = resetDailyQuestIfNeeded();
    setQuest(updatedQuest.tasks);
  }, []);

  const handleTaskToggle = (taskId: string) => {
    setQuest((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      );

      // Calculate points change
      const task = prevTasks.find((t) => t.id === taskId);
      if (!task) return prevTasks;

      const wasCompleted = task.completed;
      const isNowCompleted = !wasCompleted;

      // Update progress
      setProgress((prevProgress) => {
        let newTotalPoints = prevProgress.totalPoints;
        
        if (isNowCompleted) {
          // Task completed - add points
          newTotalPoints += task.points;
        } else {
          // Task unchecked - remove points (but don't go below 0)
          newTotalPoints = Math.max(0, newTotalPoints - task.points);
        }

        // Calculate new level
        const newLevel = calculateLevel(newTotalPoints);

        const newProgress: UserProgress = {
          level: newLevel,
          currentHealth: 0, // Will be calculated by HealthHero component
          totalHealth: 0, // Will be calculated by HealthHero component
          totalPoints: newTotalPoints,
        };

        saveUserProgress(newProgress);
        return newProgress;
      });

      // Save updated quest
      const updatedQuest = {
        tasks: updatedTasks,
        date: new Date().toISOString().split("T")[0],
      };
      saveDailyQuest(updatedQuest);

      return updatedTasks;
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">DiaBuddies</h1>
        <p className="text-muted-foreground mt-2">
          Your gamified diabetes management companion
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <HealthHero progress={progress} />
        <PointsCounter tasks={quest} />
        <QuestList tasks={quest} onTaskToggle={handleTaskToggle} />
      </div>
    </div>
  );
}
