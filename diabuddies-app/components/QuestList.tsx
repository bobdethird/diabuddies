"use client";

import { useEffect } from "react";
import type { HealthTask } from "@/types";
import { getDailyQuest, saveDailyQuest } from "@/lib/storage";
import confetti from "canvas-confetti";

interface QuestListProps {
  tasks: HealthTask[];
  onTaskToggle: (taskId: string) => void;
}

// Floating points animation function
const showPointsAnimation = (points: number, event: React.MouseEvent<HTMLDivElement>) => {
  const pointsEl = document.createElement("div");
  pointsEl.textContent = `+${points} pts!`;
  pointsEl.className = "floating-points";
  pointsEl.style.cssText = `
    position: fixed;
    left: ${event.clientX}px;
    top: ${event.clientY}px;
    color: #FFD700;
    font-size: 24px;
    font-weight: bold;
    pointer-events: none;
    z-index: 1000;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(pointsEl);

  // Trigger animation
  requestAnimationFrame(() => {
    pointsEl.style.transition = "all 1s ease-out";
    pointsEl.style.transform = "translateY(-50px)";
    pointsEl.style.opacity = "0";
  });

  setTimeout(() => pointsEl.remove(), 1000);
};

interface QuestData {
  id: string;
  title: string;
  emoji: string;
  points: number;
  descriptionUncompleted: string;
  descriptionCompleted: string;
  completed: boolean;
  isNew?: boolean;
}

export function QuestList({ tasks, onTaskToggle }: QuestListProps) {
  // Define all quest data with both uncompleted and completed descriptions
  const questData: QuestData[] = [
    {
      id: "morning-blood-sugar",
      title: "Morning Blood Sugar Check",
      emoji: "🩸",
      points: 10,
      descriptionUncompleted: "Best before 9 AM!",
      descriptionCompleted: "✨ Awesome! You checked before breakfast!",
      completed: true, // Default completed to show the state
    },
    {
      id: "morning-insulin",
      title: "Take Morning Insulin",
      emoji: "💉",
      points: 10,
      descriptionUncompleted: "Don't forget your insulin dose!",
      descriptionCompleted: "✨ Great job taking your insulin!",
      completed: false,
    },
    {
      id: "healthy-breakfast",
      title: "Eat a Healthy Breakfast",
      emoji: "🥞",
      points: 5,
      descriptionUncompleted: "Fuel up for an awesome day, champion!",
      descriptionCompleted: "✨ You fueled up like a champion!",
      completed: false,
    },
    {
      id: "water-intake",
      title: "Drink 3 Glasses of Water",
      emoji: "💧",
      points: 5,
      descriptionUncompleted: "Stay hydrated! (0/3 glasses done)",
      descriptionCompleted: "✨ Perfect! You stayed hydrated today!",
      completed: false,
    },
    {
      id: "afternoon-blood-sugar",
      title: "Afternoon Blood Sugar Check",
      emoji: "🩸",
      points: 10,
      descriptionUncompleted: "Check before lunch or your snack!",
      descriptionCompleted: "✨ Great check before your snack!",
      completed: false,
    },
    {
      id: "play-time",
      title: "10 Minutes of Play Time",
      emoji: "🏃",
      points: 5,
      descriptionUncompleted: "Move that body and have fun!",
      descriptionCompleted: "✨ You moved that body - awesome!",
      completed: false,
    },
    {
      id: "evening-blood-sugar",
      title: "Evening Blood Sugar Check",
      emoji: "🩸",
      points: 10,
      descriptionUncompleted: "Check before dinner - helps with nighttime!",
      descriptionCompleted: "✨ Excellent dinner-time check!",
      completed: false,
    },
    {
      id: "bedtime-blood-sugar",
      title: "Bedtime Blood Sugar Check",
      emoji: "🌙",
      points: 10,
      descriptionUncompleted: "NEW QUEST! Helps prevent nighttime highs!",
      descriptionCompleted: "✨ Perfect! This helps your nighttime!",
      isNew: true,
      completed: false,
    },
  ];

  // Initialize tasks in storage if they don't exist
  useEffect(() => {
    const dailyQuest = getDailyQuest();
    const existingTaskIds = dailyQuest.tasks.map((t) => t.id);
    const missingTasks: HealthTask[] = [];

    questData.forEach((quest) => {
      if (!existingTaskIds.includes(quest.id)) {
        missingTasks.push({
          id: quest.id,
          title: quest.title,
          points: quest.points,
          completed: quest.completed,
        });
      }
    });

    if (missingTasks.length > 0) {
      const updatedTasks = [...dailyQuest.tasks, ...missingTasks];
      saveDailyQuest({
        tasks: updatedTasks,
        date: dailyQuest.date,
      });
    }
  }, []);

  // Merge quest data with actual task state from props
  const quests = questData.map((quest) => {
    const task = tasks.find((t) => t.id === quest.id);
    return {
      ...quest,
      completed: task?.completed ?? quest.completed,
    };
  });

  const handleQuestClick = (questId: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if quest was completed before toggle
    const currentQuest = quests.find((q) => q.id === questId);
    const wasCompleted = currentQuest?.completed ?? false;
    
    // Get quest data for points
    const questInfo = questData.find((q) => q.id === questId);
    
    // Toggle the quest
    onTaskToggle(questId);
    
    // Only trigger celebrations if completing (not un-completing)
    if (!wasCompleted && questInfo) {
      // Trigger confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#58CC02", "#FFD700", "#1CB0F6"],
      });
      
      // Show floating points animation
      showPointsAnimation(questInfo.points, e);
    }
  };

  return (
    <div className="w-full">
      {/* Container Section */}
      <div className="bg-white rounded-[20px] p-[30px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] mb-5">
        {/* Section Title */}
        <h2 className="text-2xl font-bold text-[#333333] mb-5">
          📋 Today&apos;s Health Quests
        </h2>

        {/* Quest Cards */}
        <div className="space-y-[15px]">
          {quests.map((quest) => {
            const isCompleted = quest.completed;
            
            return (
              <div
                key={quest.id}
                onClick={(e) => handleQuestClick(quest.id, e)}
                tabIndex={0}
                role="button"
                aria-pressed={isCompleted}
                className={`
                  p-5 rounded-[15px] mb-0 min-h-[60px]
                  cursor-pointer 
                  transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                  focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2
                  active:scale-[0.98]
                  ${
                    isCompleted
                      ? "bg-gradient-to-r from-[#f0fdf4] to-white border-l-4 border-l-[#58CC02] shadow-[0_2px_8px_rgba(88,204,2,0.15)] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(88,204,2,0.2)]"
                      : "bg-[#F7F7F7] border-2 border-transparent hover:translate-y-[-3px] hover:shadow-[0_6px_20px_rgba(102,126,234,0.3)] hover:border-[#667eea]"
                  }
                  sm:p-5 sm:rounded-[15px]
                `}
              >
                {/* Card Layout - Flex Row */}
                <div className="flex items-center justify-between gap-3">
                  {/* Left Side: Checkbox + Title */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Custom Checkbox */}
                    <div
                      className={`
                        w-[25px] h-[25px] rounded-[5px] flex items-center justify-center
                        flex-shrink-0 transition-all duration-200 ease-in-out border-[3px]
                        ${
                          isCompleted
                            ? "bg-[#58CC02] border-[#58CC02]"
                            : "bg-white border-[#667eea]"
                        }
                      `}
                    >
                      {isCompleted && (
                        <span className="text-white text-[18px] font-bold leading-none">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Title + Emoji */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-lg font-bold text-[#333] sm:text-lg">
                        {quest.title}
                      </span>
                      <span className="text-lg flex-shrink-0">{quest.emoji}</span>
                      {quest.isNew && (
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Points Badge */}
                  <div
                    className={`
                      px-[15px] py-[5px] rounded-[20px]
                      font-bold text-sm flex-shrink-0 text-[#333]
                      transition-all duration-300 ease-in-out
                      ${
                        isCompleted
                          ? "bg-gradient-to-br from-[#FFD700] to-[#FFA500]"
                          : "bg-[#FFD700]"
                      }
                      sm:text-sm
                    `}
                  >
                    +{quest.points} pts
                  </div>
                </div>

                {/* Second Row: Description */}
                <div
                  className={`
                    text-sm mt-2 ml-[37px]
                    transition-colors duration-300 ease-in-out
                    ${
                      isCompleted
                        ? "text-[#16a34a] font-medium"
                        : "text-[#666]"
                    }
                    sm:text-sm
                  `}
                >
                  {isCompleted
                    ? quest.descriptionCompleted
                    : quest.descriptionUncompleted}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

