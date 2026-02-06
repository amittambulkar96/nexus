"use client";

import { cn } from "../lib/utils";
import { Bot, Zap, AlertTriangle, MoreHorizontal, Cpu, Activity } from "lucide-react";

interface Agent {
  _id: string;
  name: string;
  role: string;
  status: "idle" | "active" | "blocked" | null;
  currentTaskId?: string;
}

interface AgentCardsProps {
  agents: Agent[];
  className?: string;
}

export function AgentCards({ agents, className }: AgentCardsProps) {
  const getStatusConfig = (status: string | null) => {
    switch (status) {
      case "active":
        return {
          icon: Zap,
          label: "Active",
          color: "#10b981",
          bgColor: "bg-[#10b981]/10",
          borderColor: "border-[#10b981]/30",
          glow: "shadow-[#10b981]/20",
        };
      case "blocked":
        return {
          icon: AlertTriangle,
          label: "Blocked",
          color: "#f43f5e",
          bgColor: "bg-[#f43f5e]/10",
          borderColor: "border-[#f43f5e]/30",
          glow: "shadow-[#f43f5e]/20",
        };
      default:
        return {
          icon: Bot,
          label: "Idle",
          color: "#6b7280",
          bgColor: "bg-[#27273a]",
          borderColor: "border-[#27273a]",
          glow: "",
        };
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Agents</h2>
          <span className="px-3 py-1 rounded-full bg-[#27273a] text-xs text-[#9ca3af] font-mono">
            {agents.length} total
          </span>
        </div>
        <button className="p-2 hover:bg-[#27273a] rounded-xl transition-colors">
          <MoreHorizontal className="w-5 h-5 text-[#9ca3af]" />
        </button>
      </div>

      {/* Agents Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {agents.map((agent) => {
          const status = getStatusConfig(agent.status);
          const StatusIcon = status.icon;

          return (
            <div
              key={agent._id}
              className={cn(
                "group relative bg-[#12121a] rounded-2xl p-5 border transition-all duration-300",
                "hover:bg-[#1a1a25] hover-lift",
                status.borderColor
              )}
            >
              {/* Status glow effect */}
              {agent.status === "active" && (
                <div
                  className={cn(
                    "absolute -top-2 -right-2 w-20 h-20 rounded-full blur-2xl opacity-20",
                    status.bgColor.replace("/10", "")
                  )}
                />
              )}

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center relative",
                        "bg-gradient-to-br from-[#00f0ff] to-[#a855f7]",
                        agent.status === "active" && "shadow-lg"
                      )}
                    >
                      <Bot className="w-7 h-7 text-white" />
                      {/* Active indicator */}
                      {agent.status === "active" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10b981] border-2 border-[#12121a] pulse-glow" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-[#6b7280] truncate">{agent.role}</p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold",
                      status.bgColor
                    )}
                    style={{ color: status.color }}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>

                  {/* Activity indicator */}
                  {agent.status === "active" && (
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-[#10b981]" />
                      <span className="text-xs text-[#6b7280] font-mono">ONLINE</span>
                    </div>
                  )}
                </div>

                {/* Current Task */}
                {agent.currentTaskId && (
                  <div className="mt-4 pt-4 border-t border-[#27273a]">
                    <div className="flex items-center gap-2 text-xs text-[#6b7280] mb-1">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Current Task</span>
                    </div>
                    <p className="text-sm text-[#9ca3af] truncate font-mono">
                      {agent.currentTaskId}
                    </p>
                  </div>
                )}

                {/* Idle state decoration */}
                {!agent.currentTaskId && agent.status !== "active" && (
                  <div className="mt-4 pt-4 border-t border-[#27273a]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6b7280]" />
                      <span className="text-xs text-[#6b7280]">Awaiting assignment</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Agent Card */}
        <button className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 border-dashed border-[#27273a] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5 transition-all duration-300 min-h-[180px]">
          <div className="w-14 h-14 rounded-2xl bg-[#27273a] group-hover:bg-[#00f0ff]/10 flex items-center justify-center transition-colors">
            <Bot className="w-7 h-7 text-[#6b7280] group-hover:text-[#00f0ff] transition-colors" />
          </div>
          <span className="text-sm text-[#6b7280] group-hover:text-[#00f0ff] transition-colors">
            Add Agent
          </span>
        </button>
      </div>
    </div>
  );
}
