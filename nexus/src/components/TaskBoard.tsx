"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "inbox" | "assigned" | "in_progress" | "review" | "done" | "blocked";
  assigneeIds?: string[];
}

interface TaskBoardProps {
  tasks: Task[];
  className?: string;
}

const columns = [
  { key: "inbox", label: "Inbox", color: "bg-zinc-100 dark:bg-zinc-800" },
  { key: "in_progress", label: "In Progress", color: "bg-blue-50 dark:bg-blue-900/20" },
  { key: "review", label: "Review", color: "bg-yellow-50 dark:bg-yellow-900/20" },
  { key: "done", label: "Done", color: "bg-green-50 dark:bg-green-900/20" },
];

export function TaskBoard({ tasks, className }: TaskBoardProps) {
  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Task Board
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div
            key={column.key}
            className={cn(
              "rounded-xl p-4 min-h-[200px]",
              column.color
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-zinc-700 dark:text-zinc-300">
                {column.label}
              </h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-1 rounded-full">
                {getTasksByStatus(column.key).length}
              </span>
            </div>
            <div className="space-y-2">
              {getTasksByStatus(column.key).map((task) => (
                <div
                  key={task._id}
                  className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <h4 className="font-medium text-zinc-900 dark:text-white text-sm">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
