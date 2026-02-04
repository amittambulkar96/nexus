"use client";

import { cn } from "@/lib/utils";
import { GripVertical, MoreHorizontal } from "lucide-react";

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
  { key: "inbox", label: "Inbox", color: "bg-zinc-100 dark:bg-zinc-800/50" },
  { key: "in_progress", label: "In Progress", color: "bg-blue-50 dark:bg-blue-900/20" },
  { key: "review", label: "Review", color: "bg-yellow-50 dark:bg-yellow-900/20" },
  { key: "done", label: "Done", color: "bg-green-50 dark:bg-green-900/20" },
];

export function TaskBoard({ tasks, className }: TaskBoardProps) {
  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Task Board
        </h2>
        <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
          <MoreHorizontal className="w-5 h-5 text-zinc-400" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div
            key={column.key}
            className={cn(
              "rounded-xl p-4 min-h-[300px]",
              column.color
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">
                {column.label}
              </h3>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-1 rounded-full">
                {getTasksByStatus(column.key).length}
              </span>
            </div>
            <div className="space-y-3">
              {getTasksByStatus(column.key).map((task) => (
                <div
                  key={task._id}
                  className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-4 h-4 text-zinc-300 dark:text-zinc-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-zinc-900 dark:text-white text-sm leading-snug">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {getTasksByStatus(column.key).length === 0 && (
                <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
