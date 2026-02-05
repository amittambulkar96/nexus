"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { StatsCards } from "./StatsCards";
import { AgentCards } from "./AgentCards";
import { TaskBoard } from "./TaskBoard";
import { ActivityFeed } from "./ActivityFeed";

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const agents = useQuery(api.agents.index.list);
  const tasks = useQuery(api.tasks.index.list);
  const activities = useQuery(api.activities.index.recent, { limit: 10 });

  const stats = {
    active: agents?.filter((a) => a.status === "active").length || 0,
    inProgress: tasks?.filter((t) => t.status === "in_progress").length || 0,
    completed: tasks?.filter((t) => t.status === "done").length || 0,
    blocked: tasks?.filter((t) => t.status === "blocked").length || 0,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-grid relative">
      {/* Ambient glow effects */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#00f0ff]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#a855f7]/5 rounded-full blur-[150px] pointer-events-none" />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Main content area */}
        <div className="flex-1 lg:ml-72">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-[1920px] mx-auto space-y-8">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Command <span className="text-gradient">Center</span>
                  </h1>
                  <p className="text-[#9ca3af] mt-1 text-sm sm:text-base">
                    Monitor and manage your agent workforce
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#12121a] border border-[#27273a] rounded-full">
                  <div className="w-2 h-2 rounded-full bg-[#10b981] pulse-glow" />
                  <span className="text-sm text-[#9ca3af] font-mono">
                    {agents?.length || 0} Agents Online
                  </span>
                </div>
              </div>

              {/* Stats Row */}
              <StatsCards stats={stats} />

              {/* Main Grid - Full width utilization */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Task Board - Takes 8 columns on XL screens */}
                <div className="xl:col-span-8">
                  <TaskBoard tasks={tasks || []} />
                </div>

                {/* Activity Feed - Takes 4 columns on XL screens */}
                <div className="xl:col-span-4">
                  <ActivityFeed activities={activities || []} />
                </div>
              </div>

              {/* Agents Section - Full width */}
              <AgentCards agents={agents || []} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
