"use client";

import { cn } from "@/lib/utils";
import { Bot, Zap, AlertTriangle } from "lucide-react";

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
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return (
          <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          )}>
            <Zap className="w-3 h-3" />
            Active
          </span>
        );
      case "blocked":
        return (
          <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          )}>
            <AlertTriangle className="w-3 h-3" />
            Blocked
          </span>
        );
      default:
        return (
          <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
            "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          )}>
            <Bot className="w-3 h-3" />
            Idle
          </span>
        );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Agents
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {agents.length} total
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent._id}
            className={cn(
              "bg-white dark:bg-zinc-900 rounded-xl p-5 border transition-all hover:shadow-md",
              "border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {agent.role}
                  </p>
                </div>
              </div>
              {getStatusBadge(agent.status)}
            </div>
            
            {agent.currentTaskId && (
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Current Task
                </p>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                  {agent.currentTaskId}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
