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
    <div className="bg-[#FFC800] rounded-3xl p-6 mb-6 border-5 border-[#E6B400] shadow-[0_8px_0_0_#E6B400]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">⭐</span>
          <span className="font-black text-xl text-[#3C3C3C]">POINTS TODAY:</span>
        </div>
        <div className="text-4xl font-black text-[#3C3C3C]">
          {mounted ? totalPoints : 0}
        </div>
      </div>
    </div>
  );
}

