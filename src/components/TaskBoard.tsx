"use client";

import { cn } from "@/lib/utils";
import { GripVertical, MoreHorizontal, Plus } from "lucide-react";

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
  { 
    key: "inbox", 
    label: "Inbox", 
    color: "#6b7280",
    bgColor: "bg-[#27273a]/30",
  },
  { 
    key: "in_progress", 
    label: "In Progress", 
    color: "#00f0ff",
    bgColor: "bg-[#00f0ff]/10",
  },
  { 
    key: "review", 
    label: "Review", 
    color: "#ffb800",
    bgColor: "bg-[#ffb800]/10",
  },
  { 
    key: "done", 
    label: "Done", 
    color: "#10b981",
    bgColor: "bg-[#10b981]/10",
  },
];

export function TaskBoard({ tasks, className }: TaskBoardProps) {
  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Task Board</h2>
          <span className="px-3 py-1 rounded-full bg-[#27273a] text-xs text-[#9ca3af] font-mono">
            {tasks.length} tasks
          </span>
        </div>
        <button className="p-2 hover:bg-[#27273a] rounded-xl transition-colors">
          <MoreHorizontal className="w-5 h-5 text-[#9ca3af]" />
        </button>
      </div>

      {/* Board Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((column, colIndex) => {
          const columnTasks = getTasksByStatus(column.key);
          
          return (
            <div
              key={column.key}
              className={cn(
                "rounded-2xl p-4 min-h-[400px] border",
                "bg-[#12121a] border-[#27273a]"
              )}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: column.color, boxShadow: `0 0 10px ${column.color}` }}
                  />
                  <h3 className="font-semibold text-white">{column.label}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6b7280] font-mono">
                    {columnTasks.length}
                  </span>
                  <button className="p-1 hover:bg-[#27273a] rounded-lg transition-colors">
                    <Plus className="w-4 h-4 text-[#6b7280]" />
                  </button>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {columnTasks.map((task, taskIndex) => (
                  <div
                    key={task._id}
                    className={cn(
                      "group relative bg-[#0a0a0f] rounded-xl p-4 border border-[#27273a]",
                      "hover:border-[#3a3a55] hover-lift cursor-grab active:cursor-grabbing",
                      "transition-all duration-200"
                    )}
                    style={{ animationDelay: `${(colIndex * 4 + taskIndex) * 50}ms` }}
                  >
                    {/* Status indicator line */}
                    <div
                      className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full opacity-50"
                      style={{ backgroundColor: column.color }}
                    />

                    <div className="flex items-start gap-2 pl-3">
                      <GripVertical className="w-4 h-4 text-[#3a3a55] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm leading-snug">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-[#6b7280] mt-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        {task.assigneeIds && task.assigneeIds.length > 0 && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {task.assigneeIds.slice(0, 3).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#a855f7] border-2 border-[#0a0a0f] flex items-center justify-center"
                                >
                                  <span className="text-white text-[8px] font-bold">
                                    A{i + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {task.assigneeIds.length > 3 && (
                              <span className="text-xs text-[#6b7280]">
                                +{task.assigneeIds.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-[#27273a] rounded-xl">
                    <p className="text-sm text-[#6b7280]">No tasks</p>
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
