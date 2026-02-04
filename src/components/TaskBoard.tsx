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

  const columnStyles = {
    inbox: {
      bg: "bg-zinc-100 dark:bg-zinc-800/50",
      header: "text-zinc-600 dark:text-zinc-400",
      badge: "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
    },
    in_progress: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      header: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
    },
    review: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      header: "text-yellow-600 dark:text-yellow-400",
      badge: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400"
    },
    done: {
      bg: "bg-green-50 dark:bg-green-900/20",
      header: "text-green-600 dark:text-green-400",
      badge: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Task Board
        </h2>
        <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-zinc-400" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnTaskCount = getTasksByStatus(column.key);
          const style = columnStyles[column.key as keyof typeof columnStyles];
          
          return (
            <div
              key={column.key}
              className={cn(
                "rounded-xl p-4 min-h-[320px]",
                style?.bg || column.color
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn("font-semibold", style?.header || "text-zinc-700 dark:text-zinc-300")}>
                  {column.label}
                </h3>
                <span className={cn("text-xs font-medium px-2 py-1 rounded-full", style?.badge || "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400")}>
                  {columnTaskCount.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnTaskCount.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-zinc-300 dark:text-zinc-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-zinc-900 dark:text-white text-sm leading-snug">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        {task.assigneeIds && task.assigneeIds.length > 0 && (
                          <div className="mt-2 flex items-center gap-1">
                            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-[10px] font-medium">A</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {columnTaskCount.length === 0 && (
                  <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 text-sm">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
