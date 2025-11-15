"use client";

import { useEffect, useState } from "react";
import { Sparkles, Star } from "lucide-react";
import { HealthHero } from "@/components/HealthHero";
import { QuestList } from "@/components/QuestList";
import { PointsCounter } from "@/components/PointsCounter";
import { PdfUploadButton } from "@/components/PdfUploadButton";
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

  const handleTasksGenerated = (newTasks: HealthTask[]) => {
    // Replace existing tasks with AI-generated ones
    setQuest(newTasks);
    
    // Save to localStorage
    const updatedQuest = {
      tasks: newTasks,
      date: new Date().toISOString().split("T")[0],
    };
    saveDailyQuest(updatedQuest);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Playful Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 py-8 px-6 shadow-lg">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 w-3 h-3 bg-white rounded-full animate-float" />
          <div className="absolute top-12 right-20 w-2 h-2 bg-white rounded-full animate-float-delayed" />
          <div className="absolute bottom-8 left-1/4 w-2.5 h-2.5 bg-white rounded-full animate-float" />
          <div className="absolute bottom-4 right-1/3 w-3 h-3 bg-white rounded-full animate-float-delayed" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse-gentle" />
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              Dia<span className="text-yellow-300">Buddies</span>
            </h1>
            <Star className="w-7 h-7 text-yellow-300 animate-sparkle" />
          </div>
          <p className="text-center text-xl md:text-2xl text-white/90 font-semibold drop-shadow-md mb-4">
            Your Health Adventure Starts Today! ✨
          </p>
          <div className="flex justify-center">
            <PdfUploadButton onTasksGenerated={handleTasksGenerated} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="flex flex-col gap-6">
          <HealthHero progress={progress} />
          <PointsCounter tasks={quest} />
          <QuestList tasks={quest} onTaskToggle={handleTaskToggle} />
        </div>
      </div>
    </div>
  );
}
