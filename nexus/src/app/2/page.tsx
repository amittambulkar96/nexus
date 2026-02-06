"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Inter } from "next/font/google";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  Zap, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Activity,
  Terminal,
  GitBranch,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "inbox" | "assigned" | "in_progress" | "review" | "done" | "blocked";
  assigneeIds?: string[];
  createdAt: number;
}

interface Agent {
  _id: string;
  name: string;
  role: string;
  status: "idle" | "active" | "blocked";
  currentTaskId?: string;
}

const columns = [
  { key: "inbox", label: "Inbox", color: "#6366f1", gradient: "from-indigo-500 to-purple-500" },
  { key: "in_progress", label: "In Progress", color: "#8b5cf6", gradient: "from-violet-500 to-purple-500" },
  { key: "review", label: "Review", color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
  { key: "done", label: "Done", color: "#10b981", gradient: "from-emerald-500 to-teal-500" },
];

export default function DashboardTwo() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const agents = useQuery(api.agents.index.list) || [];
  const tasks = useQuery(api.tasks.index.list) || [];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setSelectedAgent(null);
    setSheetOpen(true);
  };

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setSelectedTask(null);
    setSheetOpen(true);
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Zap className="w-3.5 h-3.5" />;
      case "blocked": return <AlertTriangle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className={`${inter.variable} min-h-screen bg-[#0a0a0f] font-sans`}>
      <div className="flex h-screen">
        {/* Sidebar - Agents */}
        <aside className="w-72 border-r border-white/10 bg-[#0f0f10] flex flex-col">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-50" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-semibold text-white text-lg">Nexus</h1>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Agent OS</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="flex items-center justify-between mb-3 px-2">
              <h2 className="text-xs font-medium text-white/60 uppercase tracking-wider">Agents</h2>
              <span className="text-xs text-white/40 font-mono bg-white/5 px-2 py-0.5 rounded">{agents.length}</span>
            </div>

            <div className="space-y-1">
              {agents.map((agent) => (
                <button
                  key={agent._id}
                  onClick={() => handleAgentClick(agent)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all group text-left"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-indigo-300">
                        {agent.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f0f10]",
                      agent.status === "active" ? "bg-emerald-500" : 
                      agent.status === "blocked" ? "bg-rose-500" : "bg-white/30"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate">{agent.name}</p>
                    <p className="text-xs text-white/50 truncate">{agent.role}</p>
                  </div>
                  {agent.status === "active" && (
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{agents.filter(a => a.status === "active").length} agents active</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Command Center</h1>
                <p className="text-sm text-white/50 mt-0.5">Monitor and manage your agent workforce</p>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href="/1" 
                  className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Design 1
                </a>
                <a 
                  href="/3" 
                  className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Design 3
                </a>
              </div>
            </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto">
            {/* Task Board */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-white/80 uppercase tracking-wider">Task Board</h2>
                <span className="text-xs text-white/40 font-mono bg-white/5 px-2 py-1 rounded">{tasks.length} tasks</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {columns.map((column) => {
                  const columnTasks = getTasksByStatus(column.key);
                  
                  return (
                    <div key={column.key} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <div className={cn("w-2 h-2 rounded-full bg-gradient-to-br", column.gradient)} />
                        <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">
                          {column.label}
                        </h3>
                        <span className="text-xs text-white/40 font-mono ml-auto">
                          {columnTasks.length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {columnTasks.map((task) => (
                          <button
                            key={task._id}
                            onClick={() => handleTaskClick(task)}
                            className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group"
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn("w-1 self-stretch rounded-full bg-gradient-to-b", column.gradient)} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white/90 line-clamp-2 mb-2">
                                  {task.title}
                                </p>
                                {task.assigneeIds && task.assigneeIds.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <div className="flex -space-x-1.5">
                                      {task.assigneeIds.slice(0, 3).map((_, i) => (
                                        <div
                                          key={i}
                                          className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center"
                                        >
                                          <span className="text-[8px] font-medium text-white/80">
                                            A{i + 1}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    {task.assigneeIds.length > 3 && (
                                      <span className="text-[10px] text-white/40 ml-1">
                                        +{task.assigneeIds.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}

                        {columnTasks.length === 0 && (
                          <div className="p-4 border border-dashed border-white/10 rounded-xl text-center">
                            <p className="text-xs text-white/40">No tasks</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sheet for Task/Agent Details */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] bg-[#0f0f10] border-l border-white/10">
          {selectedTask && (
            <>
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs font-mono uppercase border-white/20 text-white/70 bg-white/5"
                  >
                    {selectedTask.status}
                  </Badge>
                </div>
                <SheetTitle className="text-xl font-semibold text-white">
                  {selectedTask.title}
                </SheetTitle>
                {selectedTask.description && (
                  <SheetDescription className="text-sm text-white/60">
                    {selectedTask.description}
                  </SheetDescription>
                )}
              </SheetHeader>

              <Separator className="my-6 bg-white/10" />

              <div className="space-y-6">
                {selectedTask.status === "done" && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5" />
                      Agent Output
                    </h3>
                    <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-white/70 border border-white/10 overflow-x-auto">
                      <div className="space-y-1">
                        <p><span className="text-emerald-400">➜</span> <span className="text-indigo-400">~</span> task execute</p>
                        <p className="text-white/50">[INFO] Initializing agent...</p>
                        <p className="text-white/50">[INFO] Loading context...</p>
                        <p><span className="text-emerald-400">[SUCCESS]</span> Task completed</p>
                        <p className="text-white/50">Output generated in 2.3s</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/50">Created</span>
                      <span className="text-white/90 font-mono">
                        {new Date(selectedTask.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/50">Assignees</span>
                      <span className="text-white/90">
                        {selectedTask.assigneeIds?.length || 0} agents
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/50">Task ID</span>
                      <span className="text-white/50 font-mono text-xs">{selectedTask._id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedAgent && (
            <>
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-lg opacity-50" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center">
                      <span className="text-lg font-medium text-indigo-300">
                        {selectedAgent.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <SheetTitle className="text-xl font-semibold text-white">
                      {selectedAgent.name}
                    </SheetTitle>
                    <p className="text-sm text-white/50">{selectedAgent.role}</p>
                  </div>
                </div>
              </SheetHeader>

              <Separator className="my-6 bg-white/10" />

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs border-white/20",
                      selectedAgent.status === "active" ? "text-emerald-400 bg-emerald-500/10" :
                      selectedAgent.status === "blocked" ? "text-rose-400 bg-rose-500/10" :
                      "text-white/60 bg-white/5"
                    )}
                  >
                    {getStatusIcon(selectedAgent.status)}
                    <span className="ml-1 capitalize">{selectedAgent.status}</span>
                  </Badge>
                </div>

                {selectedAgent.currentTaskId && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5" />
                      Current Task
                    </h3>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-sm text-white/70 font-mono">{selectedAgent.currentTaskId}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">Activity Log</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white/80">Task completed</p>
                        <p className="text-xs text-white/40">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                        <GitBranch className="w-3 h-3 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white/80">Came online</p>
                        <p className="text-xs text-white/40">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
