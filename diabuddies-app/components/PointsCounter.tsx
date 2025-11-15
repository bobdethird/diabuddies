"use client";

import { useEffect, useState } from "react";
import type { HealthTask } from "@/types";

interface PointsCounterProps {
  tasks: HealthTask[];
}

export function PointsCounter({ tasks }: PointsCounterProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculatePoints = () => {
    return tasks
      .filter((task) => task.completed)
      .reduce((total, task) => total + task.points, 0);
  };

  const totalPoints = calculatePoints();

  return (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-md border-2 border-[#FFD700]/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="font-bold text-gray-700">Points Today:</span>
        </div>
        <div className="text-3xl font-bold text-yellow-500">
          {mounted ? totalPoints : 0} pts
        </div>
      </div>
    </div>
  );
}

