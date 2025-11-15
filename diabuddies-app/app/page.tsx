"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Star } from "lucide-react";
import { HealthHero } from "@/components/HealthHero";
import { QuestList } from "@/components/QuestList";
import { PointsCounter } from "@/components/PointsCounter";
import { PdfUploadButton } from "@/components/PdfUploadButton";
import {
  getUserProgress,
  resetDailyQuestIfNeeded,
  isAuthenticated,
  getUserName,
} from "@/lib/storage";
import { calculateLevel } from "@/lib/leveling";
import type { UserProgress, HealthTask, DetailedInsight } from "@/types";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress>(() => ({
    level: 1,
    currentHealth: 0,
    totalHealth: 10,
    totalPoints: 0,
  }));
  const [quest, setQuest] = useState<HealthTask[]>([]);
  const [healthInsights, setHealthInsights] = useState<string[]>([]);
  const [detailedInsights, setDetailedInsights] = useState<DetailedInsight[]>([]);

  // Check authentication and load data only on client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/signin");
      return;
    }
    
    // Get user name
    const name = getUserName();
    setUserName(name);
    
    const initialProgress = getUserProgress();
    const updatedQuest = resetDailyQuestIfNeeded();    
    // Ensure level is calculated correctly based on totalPoints
    const correctLevel = calculateLevel(initialProgress.totalPoints);
    
    const syncedProgress: UserProgress = {
      ...initialProgress,
      level: correctLevel,
    };
    
    setProgress(syncedProgress);
    setQuest(updatedQuest.tasks);
  }, [router]);

  // Don't render content until mounted and authenticated
  if (!mounted || !isAuthenticated()) {
    return null;
  }

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

        return newProgress;
      });

      return updatedTasks;
    });
  };

  const handleTasksGenerated = (newTasks: HealthTask[], insights?: string[], detailedInsightsData?: DetailedInsight[]) => {
    // Merge new AI-generated tasks with existing tasks
    // Keep existing default quests and add new AI-generated tasks
    setQuest((prevTasks) => {
      // Get IDs of default quests (from questData in QuestList)
      const defaultQuestIds = [
        "morning-blood-sugar",
        "morning-insulin",
        "healthy-breakfast",
        "water-intake",
        "afternoon-blood-sugar",
        "play-time",
        "evening-blood-sugar",
        "bedtime-blood-sugar",
      ];
      
      // Keep existing default quests
      const existingDefaultQuests = prevTasks.filter((task) =>
        defaultQuestIds.includes(task.id)
      );
      
      // Remove old AI-generated tasks (those not in defaultQuestIds)
      // and add new AI-generated tasks
      const existingNonDefaultTasks = prevTasks.filter(
        (task) => !defaultQuestIds.includes(task.id)
      );
      
      // Combine: keep default quests + new AI tasks
      // Remove duplicates by keeping the first occurrence
      const allTasks = [...existingDefaultQuests, ...newTasks];
      const uniqueTasks = allTasks.filter(
        (task, index, self) => index === self.findIndex((t) => t.id === task.id)
      );
      
      return uniqueTasks;
    });
    
    // Store health insights for avatar comments
    if (insights && insights.length > 0) {
      setHealthInsights(insights);
    }
    
    // Store detailed insights for modal
    if (detailedInsightsData && detailedInsightsData.length > 0) {
      setDetailedInsights(detailedInsightsData);
    }
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
            {userName ? `Welcome back, ${userName}! ✨` : "Your Health Adventure Starts Today! ✨"}
          </p>
          <div className="flex justify-center">
            <PdfUploadButton onTasksGenerated={handleTasksGenerated} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="flex flex-col gap-6">
          <HealthHero progress={progress} healthInsights={healthInsights} detailedInsights={detailedInsights} />
          <PointsCounter tasks={quest} />
          <QuestList tasks={quest} onTaskToggle={handleTaskToggle} />
        </div>
      </div>
    </div>
  );
}
