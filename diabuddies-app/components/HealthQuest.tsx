"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { 
  Syringe, 
  UtensilsCrossed, 
  Droplet, 
  CheckCircle2,
  Star
} from "lucide-react";
import type { HealthTask } from "@/types";

interface HealthQuestProps {
  tasks: HealthTask[];
  onTaskToggle: (taskId: string) => void;
}

// Map task titles to icons
function getTaskIcon(title: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("insulin")) {
    return <Syringe className="w-5 h-5" />;
  }
  if (lowerTitle.includes("breakfast") || lowerTitle.includes("eat")) {
    return <UtensilsCrossed className="w-5 h-5" />;
  }
  if (lowerTitle.includes("water") || lowerTitle.includes("drink")) {
    return <Droplet className="w-5 h-5" />;
  }
  return <Star className="w-5 h-5" />;
}

// Get icon color based on task completion
function getIconColor(completed: boolean, taskId: string) {
  if (completed) return "text-green-500";
  
  // Different colors for different tasks
  if (taskId === "1") return "text-blue-500";
  if (taskId === "2") return "text-orange-500";
  if (taskId === "3") return "text-cyan-500";
  return "text-purple-500";
}

export function HealthQuest({ tasks, onTaskToggle }: HealthQuestProps) {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="relative">
      {/* Quest Card */}
      <div className="relative rounded-3xl bg-white p-8 shadow-2xl border-4 border-blue-200 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 opacity-40 blur-2xl -z-10" />
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-300 rounded-full opacity-20 blur-xl" />
        <div className="absolute bottom-4 left-4 w-20 h-20 bg-pink-300 rounded-full opacity-20 blur-xl" />

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold gradient-text-blue mb-2 flex items-center gap-2">
            <Star className="w-7 h-7 text-yellow-400" />
            Today&apos;s Health Quest
          </h2>
          
          {/* Progress Counter */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full shadow-lg">
              <Star className="w-4 h-4 fill-white" />
              <span className="font-bold text-lg">
                {completedTasks}/{totalTasks}
              </span>
              <span className="text-sm font-semibold ml-1">quests completed</span>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => {
            const Icon = getTaskIcon(task.title);
            const iconColor = getIconColor(task.completed, task.id);
            
            return (
              <div
                key={task.id}
                className={`group relative rounded-2xl p-5 transition-all duration-300 border-2 ${
                  task.completed
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md"
                    : "bg-white border-blue-200 hover:border-blue-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                }`}
                onClick={() => !task.completed && onTaskToggle(task.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Animated Checkbox */}
                  <div className="relative">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => onTaskToggle(task.id)}
                      id={task.id}
                      className={`w-6 h-6 border-2 ${
                        task.completed
                          ? "bg-green-500 border-green-600"
                          : "border-blue-400"
                      }`}
                    />
                    {task.completed && (
                      <CheckCircle2 className="absolute inset-0 w-6 h-6 text-green-600 animate-bounce-hover pointer-events-none" />
                    )}
                  </div>

                  {/* Task Icon */}
                  <div className={`${iconColor} ${task.completed ? "opacity-60" : ""}`}>
                    {Icon}
                  </div>

                  {/* Task Title */}
                  <label
                    htmlFor={task.id}
                    className={`flex-1 cursor-pointer font-semibold text-base ${
                      task.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </label>

                  {/* Points Badge */}
                  <div
                    className={`rounded-full px-4 py-1.5 text-sm font-bold shadow-md transition-all ${
                      task.completed
                        ? "bg-green-200 text-green-700"
                        : "bg-gradient-to-r from-orange-400 to-pink-400 text-white hover:scale-110"
                    }`}
                  >
                    +{task.points} pts
                  </div>
                </div>

                {/* Completion Animation Overlay */}
                {task.completed && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-2xl pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Encouragement Message */}
        {completedTasks === totalTasks && (
          <div className="mt-6 text-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300">
            <p className="text-lg font-bold text-orange-700">
              🎉 Amazing! You completed all quests today! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
