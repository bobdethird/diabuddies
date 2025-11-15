"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { HealthTask } from "@/types";

interface HealthQuestProps {
  tasks: HealthTask[];
  onTaskToggle: (taskId: string) => void;
}

export function HealthQuest({ tasks, onTaskToggle }: HealthQuestProps) {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Health Quest</CardTitle>
        <div className="text-sm text-muted-foreground">
          {completedTasks} of {totalTasks} tasks completed
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/50"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onTaskToggle(task.id)}
                id={task.id}
              />
              <label
                htmlFor={task.id}
                className={`flex-1 cursor-pointer text-sm ${
                  task.completed
                    ? "text-muted-foreground line-through"
                    : "font-medium"
                }`}
              >
                {task.title}
              </label>
              <div
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  task.completed
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                +{task.points} pts
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

