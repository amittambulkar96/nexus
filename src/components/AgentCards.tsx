"use client";

import { cn } from "@/lib/utils";

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
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Agents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent._id}
            className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-white">
                  {agent.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {agent.role}
                </p>
              </div>
              <div
                className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  agent.status === "active"
                    ? "bg-green-500"
                    : agent.status === "blocked"
                    ? "bg-red-500"
                    : "bg-zinc-300 dark:bg-zinc-600"
                )}
              />
            </div>
            {agent.currentTaskId && (
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Working on task
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
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
