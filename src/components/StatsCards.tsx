"use client";

import { cn } from "@/lib/utils";
import { Users, Clock, CheckCircle2, AlertOctagon, TrendingUp } from "lucide-react";

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
      label: "Active Agents",
      value: stats.active,
      icon: Users,
      color: "#10b981",
      bgColor: "bg-[#10b981]/10",
      borderColor: "border-[#10b981]/30",
      trend: "+12%",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "#ffb800",
      bgColor: "bg-[#ffb800]/10",
      borderColor: "border-[#ffb800]/30",
      trend: "+5%",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "#00f0ff",
      bgColor: "bg-[#00f0ff]/10",
      borderColor: "border-[#00f0ff]/30",
      trend: "+23%",
    },
    {
      label: "Blocked",
      value: stats.blocked,
      icon: AlertOctagon,
      color: "#f43f5e",
      bgColor: "bg-[#f43f5e]/10",
      borderColor: "border-[#f43f5e]/30",
      trend: "-2%",
    },
  ];

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {cards.map((card, index) => (
        <div
          key={card.label}
          className={cn(
            "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
            "bg-[#12121a] hover:bg-[#1a1a25]",
            card.borderColor,
            "hover-lift"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Background glow */}
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl"
            style={{ backgroundColor: card.color }}
          />

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  card.bgColor
                )}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium">
                <TrendingUp className="w-3 h-3" style={{ color: card.color }} />
                <span style={{ color: card.color }}>{card.trend}</span>
              </div>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {card.value}
              </p>
              <p className="text-sm text-[#9ca3af] mt-1">{card.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
