"use client";

import { cn } from "@/lib/utils";
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

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
    { 
      label: "Active", 
      value: stats.active, 
      icon: Users,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-500"
    },
    { 
      label: "In Progress", 
      value: stats.inProgress, 
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
      iconColor: "text-yellow-500"
    },
    { 
      label: "Completed", 
      value: stats.completed, 
      icon: CheckCircle,
      color: "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      iconColor: "text-green-500"
    },
    { 
      label: "Blocked", 
      value: stats.blocked, 
      icon: AlertCircle,
      color: "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      iconColor: "text-red-500"
    },
  ];

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "bg-white dark:bg-zinc-900 rounded-xl p-4 border",
            card.color
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {card.label}
            </span>
            <card.icon className={cn("w-4 h-4", card.iconColor)} />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
