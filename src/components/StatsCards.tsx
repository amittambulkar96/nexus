"use client";

import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    active: number;
    inProgress: number;
    completed: number;
    blocked: number;
  };
  className?: string;
}

export function StatsCards({ stats, className }: StatsCardsProps) {
  const cards = [
    { label: "Active", value: stats.active, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
    { label: "In Progress", value: stats.inProgress, color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" },
    { label: "Completed", value: stats.completed, color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
    { label: "Blocked", value: stats.blocked, color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
  ];

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {card.label}
            </span>
            <div className={cn("w-2 h-2 rounded-full", card.color.split(" ")[0])} />
          </div>
          <p className="text-2xl font-semibold text-zinc-900 dark:text-white mt-1">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
