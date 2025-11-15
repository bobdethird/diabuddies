"use client";

import { useState } from "react";
import type { HealthTask } from "@/types";
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
  // Track which quests should be hidden (after delay)
  const [hiddenQuestIds, setHiddenQuestIds] = useState<Set<string>>(new Set());

  // Define all quest data with both uncompleted and completed descriptions
  const questData: QuestData[] = [
    {
      id: "morning-blood-sugar",
      title: "Morning Blood Sugar Check",
      emoji: "🩸",
      points: 10,
      descriptionUncompleted: "Best before 9 AM!",
      descriptionCompleted: "✨ Awesome! You checked before breakfast!",
      completed: false,
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

  // Merge quest data with actual task state from props
  // First, get tasks that match questData
  const matchedQuests = questData.map((quest) => {
    const task = tasks.find((t) => t.id === quest.id);
    return {
      ...quest,
      completed: task?.completed ?? quest.completed,
    };
  });

  // Then, get tasks that don't match any questData (AI-generated tasks)
  const unmatchedTasks = tasks.filter(
    (task) => !questData.some((quest) => quest.id === task.id)
  );

  // Convert unmatched tasks to quest format with default values
  const aiQuests = unmatchedTasks.map((task) => ({
    id: task.id,
    title: task.title,
    emoji: "📋", // Default emoji for AI-generated tasks
    points: task.points,
    descriptionUncompleted: `Complete this health task!`,
    descriptionCompleted: "✨ Great job completing this task!",
    completed: task.completed,
    isNew: true, // Mark AI-generated tasks as new
  }));

  // Combine matched and unmatched quests
  const allQuests = [...matchedQuests, ...aiQuests];
  
  // Filter: show incomplete quests, or completed quests that haven't been hidden yet
  const quests = allQuests.filter((quest) => {
    if (!quest.completed) return true; // Always show incomplete quests
    return !hiddenQuestIds.has(quest.id); // Show completed quests until they're hidden
  });

  const handleQuestClick = (questId: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if quest was completed before toggle (check allQuests, not filtered quests)
    const currentQuest = allQuests.find((q) => q.id === questId);
    const wasCompleted = currentQuest?.completed ?? false;
    
    // Get quest data for points (from either questData or aiQuests)
    const questInfo = allQuests.find((q) => q.id === questId);
    
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
      
      // Hide the quest after 1 second delay
      setTimeout(() => {
        setHiddenQuestIds((prev) => new Set(prev).add(questId));
      }, 1000);
    }
  };

  return (
    <div className="w-full">
      {/* Container Section - Chunky Duolingo Style */}
      <div className="bg-white rounded-3xl p-8 border-5 border-[#58CC02] shadow-[0_10px_0_0_rgba(70,163,2,0.2)] mb-5">
        {/* Section Title */}
        <h2 className="text-3xl font-black text-[#3C3C3C] mb-6 flex items-center gap-3">
          <span className="text-4xl">📋</span>
          TODAY&apos;S HEALTH QUESTS
        </h2>

        {/* Quest Cards */}
        <div className="space-y-[15px]">
          {quests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-xl font-bold text-gray-600 mb-2">All Done!</p>
              <p className="text-gray-500">You&apos;ve completed all your health quests today!</p>
            </div>
          ) : (
            quests.map((quest) => {
              const isCompleted = quest.completed;
              const isHiding = isCompleted && !hiddenQuestIds.has(quest.id);
              
              return (
                <div
                  key={quest.id}
                  onClick={(e) => handleQuestClick(quest.id, e)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isCompleted}
                  className={`
                    p-6 rounded-2xl mb-0 min-h-[70px]
                    cursor-pointer 
                    transition-all duration-200 ease-out
                    focus:outline-none focus:ring-4 focus:ring-[#1CB0F6] focus:ring-offset-2
                    active:translate-y-[2px]
                    ${
                      isCompleted
                        ? "bg-[#E8F5E9] border-4 border-[#58CC02] shadow-[0_6px_0_0_rgba(70,163,2,0.3)] opacity-100"
                        : "bg-white border-4 border-[#E5E5E5] hover:-translate-y-[2px] hover:shadow-[0_8px_0_0_rgba(28,176,246,0.2)] hover:border-[#1CB0F6]"
                    }
                    ${isHiding ? "animate-fade-out" : ""}
                    sm:p-6 sm:rounded-2xl
                  `}
                >
                {/* Card Layout - Flex Row */}
                <div className="flex items-center justify-between gap-3">
                  {/* Left Side: Checkbox + Title */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Chunky Custom Checkbox */}
                    <div
                      className={`
                        w-[32px] h-[32px] rounded-lg flex items-center justify-center
                        flex-shrink-0 transition-all duration-200 ease-out border-4
                        ${
                          isCompleted
                            ? "bg-[#58CC02] border-[#46A302] shadow-[0_3px_0_0_#46A302]"
                            : "bg-white border-[#E5E5E5] shadow-[0_3px_0_0_rgba(0,0,0,0.1)]"
                        }
                      `}
                    >
                      {isCompleted && (
                        <span className="text-white text-[22px] font-black leading-none">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Title + Emoji */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-lg font-extrabold text-[#3C3C3C] sm:text-lg">
                        {quest.title}
                      </span>
                      <span className="text-xl flex-shrink-0">{quest.emoji}</span>
                      {quest.isNew && (
                        <span className="bg-[#FF4B4B] text-white text-xs font-black px-3 py-1 rounded-full flex-shrink-0 shadow-[0_2px_0_0_#D93A3A]">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Chunky Points Badge */}
                  <div className={`
                    px-5 py-2 rounded-2xl
                    font-black text-base flex-shrink-0 text-[#3C3C3C]
                    transition-all duration-200 ease-out
                    border-3 border-[#E6B400] shadow-[0_4px_0_0_#E6B400]
                    ${
                      isCompleted
                        ? "bg-[#FFC800]"
                        : "bg-[#FFC800]"
                    }
                    sm:text-base
                  `}>
                    +{quest.points}
                  </div>
                </div>

                {/* Second Row: Description */}
                <div className={`
                  text-sm mt-2 ml-[44px]
                  transition-colors duration-200 ease-out
                  ${
                    isCompleted
                      ? "text-[#46A302] font-bold"
                      : "text-[#666] font-semibold"
                  }
                  sm:text-sm
                `}>
                  {isCompleted
                    ? quest.descriptionCompleted
                    : quest.descriptionUncompleted}
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
}

