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
      bgColor: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/40"
    },
    { 
      label: "In Progress", 
      value: stats.inProgress, 
      icon: Clock,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/40"
    },
    { 
      label: "Completed", 
      value: stats.completed, 
      icon: CheckCircle,
      bgColor: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/40"
    },
    { 
      label: "Blocked", 
      value: stats.blocked, 
      icon: AlertCircle,
      bgColor: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      iconColor: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-900/40"
    },
  ];

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "bg-white dark:bg-zinc-900 rounded-xl p-5 border transition-all hover:shadow-md",
            card.bgColor
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {card.label}
            </span>
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", card.iconBg)}>
              <card.icon className={cn("w-4 h-4", card.iconColor)} />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
