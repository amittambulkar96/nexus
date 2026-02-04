"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { StatsCards } from "./StatsCards";
import { AgentCards } from "./AgentCards";
import { TaskBoard } from "./TaskBoard";
import { ActivityFeed } from "./ActivityFeed";

export function Dashboard() {
  const agents = useQuery(api.agents.index.list);
  const tasks = useQuery(api.tasks.index.list);
  const activities = useQuery(api.activities.index.recent, { limit: 10 });

  const stats = {
    active:
      agents?.filter((a) => a.status === "active").length || 0,
    inProgress:
      tasks?.filter((t) => t.status === "in_progress").length || 0,
    completed:
      tasks?.filter((t) => t.status === "done").length || 0,
    blocked:
      tasks?.filter((t) => t.status === "blocked").length || 0,
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Dashboard
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                  Monitor your agent team&apos;s performance and activity
                </p>
              </div>

              {/* Stats */}
              <StatsCards stats={stats} />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Task Board */}
                <div className="xl:col-span-2">
                  <TaskBoard tasks={tasks || []} />
                </div>

                {/* Right Column - Activity Feed */}
                <div>
                  <ActivityFeed activities={activities || []} />
                </div>
              </div>

              {/* Agents Section */}
              <AgentCards agents={agents || []} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
