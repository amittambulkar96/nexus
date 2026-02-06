"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
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
  Sparkles,
  GitBranch,
  Layers,
  TrendingUp,
  Users
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
  priority?: "low" | "medium" | "high";
  createdAt: number;
}

interface Agent {
  _id: string;
  name: string;
  role: string;
  status: "idle" | "active" | "blocked";
  currentTaskId?: string;
  avatar?: string;
}

const columns = [
  { key: "inbox", label: "Inbox", color: "#6B7280", lightColor: "bg-gray-100" },
  { key: "in_progress", label: "In Progress", color: "#3B82F6", lightColor: "bg-blue-50" },
  { key: "review", label: "Review", color: "#F59E0B", lightColor: "bg-amber-50" },
  { key: "done", label: "Done", color: "#10B981", lightColor: "bg-emerald-50" },
];

export default function DashboardThree() {
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

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "bg-rose-500";
      case "medium": return "bg-amber-500";
      default: return "bg-blue-500";
    }
  };

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === "active").length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === "done").length,
  };

  return (
    <div className={`${inter.variable} min-h-screen bg-slate-50 text-slate-900 font-sans`}>
      <div className="flex h-screen">
        {/* Sidebar - Agents */}
        <aside className="w-72 border-r border-slate-200 bg-white flex flex-col shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900 text-base tracking-tight">Nexus</h1>
                <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Agent OS</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="flex items-center justify-between mb-3 px-2">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agents</h2>
              <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">{agents.length}</span>
            </div>

            <div className="space-y-1">
              {agents.map((agent) => (
                <button
                  key={agent._id}
                  onClick={() => handleAgentClick(agent)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-all group text-left"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white",
                      agent.status === "active" ? "bg-emerald-500" : 
                      agent.status === "blocked" ? "bg-rose-500" : "bg-slate-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{agent.name}</p>
                    <p className="text-xs text-slate-500 truncate">{agent.role}</p>
                  </div>
                  {agent.status === "active" && (
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-600 font-medium">
                {agents.filter(a => a.status === "active").length} agents active
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Command Center</h1>
                <span className="px-2 py-0.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-100">
                  v2.0
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href="/1" 
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Design 1
                </a>
                <a 
                  href="/2" 
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Design 2
                </a>
              </div>
            </div>
          </header>

          <div className="p-6 max-w-7xl mx-auto">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Agents</span>
                </div>
                <p className="text-2xl font-semibold text-slate-900">{stats.totalAgents}</p>
                <p className="text-xs text-slate-500 mt-1">{stats.activeAgents} active</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tasks</span>
                </div>
                <p className="text-2xl font-semibold text-slate-900">{stats.totalTasks}</p>
                <p className="text-xs text-slate-500 mt-1">{stats.completedTasks} completed</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</span>
                </div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Completion rate</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
                </div>
                <p className="text-2xl font-semibold text-slate-900">
                  {agents.filter(a => a.status === "active").length > 0 ? "Active" : "Idle"}
                </p>
                <p className="text-xs text-slate-500 mt-1">System status</p>
              </div>
            </div>

            {/* Task Board */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-semibold text-slate-900">Task Board</h2>
                </div>
                <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">{tasks.length} tasks</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {columns.map((column) => {
                  const columnTasks = getTasksByStatus(column.key);
                  
                  return (
                    <div key={column.key} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: column.color }}
                        />
                        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          {column.label}
                        </h3>
                        <span className="text-xs text-slate-400 font-medium ml-auto">
                          {columnTasks.length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {columnTasks.map((task) => (
                          <button
                            key={task._id}
                            onClick={() => handleTaskClick(task)}
                            className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-1 h-full min-h-[16px] rounded-full flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: column.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-medium text-slate-900 line-clamp-2">
                                    {task.title}
                                  </p>
                                  {task.priority && (
                                    <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5", getPriorityColor(task.priority))} />
                                  )}
                                </div>
                                {task.assigneeIds && task.assigneeIds.length > 0 && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <div className="flex -space-x-1.5">
                                      {task.assigneeIds.slice(0, 3).map((_, i) => (
                                        <div
                                          key={i}
                                          className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white flex items-center justify-center"
                                        >
                                          <span className="text-[8px] font-medium text-white">
                                            A{i + 1}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}

                        {columnTasks.length === 0 && (
                          <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                            <p className="text-xs text-slate-400">No tasks</p>
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

      {/* Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[480px] bg-white border-l border-slate-200 p-0">
          <div className="h-full flex flex-col">
            {selectedTask && (
              <>
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge 
                      variant="outline" 
                      className="text-[10px] font-medium uppercase tracking-wider bg-slate-50 border-slate-200 text-slate-600"
                    >
                      {selectedTask.status}
                    </Badge>
                    {selectedTask.priority && (
                      <div className={cn("w-1.5 h-1.5 rounded-full", getPriorityColor(selectedTask.priority))} />
                    )}
                  </div>
                  <SheetTitle className="text-lg font-semibold text-slate-900">
                    {selectedTask.title}
                  </SheetTitle>
                  {selectedTask.description && (
                    <SheetDescription className="text-sm text-slate-600 mt-2">
                      {selectedTask.description}
                    </SheetDescription>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {selectedTask.status === "done" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <Terminal className="w-3.5 h-3.5" />
                        Output
                      </div>
                      <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300">
                        <div className="space-y-1.5">
                          <p><span className="text-emerald-400">➜</span> Task completed successfully</p>
                          <p className="text-slate-500"><span className="text-slate-600">│</span></p>
                          <p className="text-slate-500"><span className="text-slate-600">├─</span> Processing time: 2.3s</p>
                          <p className="text-slate-500"><span className="text-slate-600">├─</span> Memory usage: 128MB</p>
                          <p className="text-slate-500"><span className="text-slate-600">└─</span> Deliverables: 3 files generated</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                        <span className="text-slate-500">Created</span>
                        <span className="text-slate-900 font-medium">
                          {new Date(selectedTask.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                        <span className="text-slate-500">Assignees</span>
                        <span className="text-slate-900 font-medium">
                          {selectedTask.assigneeIds?.length || 0} agents
                        </span>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                        <span className="text-slate-500">Task ID</span>
                        <span className="text-slate-400 font-mono text-xs">{selectedTask._id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedAgent && (
              <>
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
                      {selectedAgent.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <SheetTitle className="text-lg font-semibold text-slate-900">
                        {selectedAgent.name}
                      </SheetTitle>
                      <p className="text-sm text-slate-500">{selectedAgent.role}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                      selectedAgent.status === "active" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                      selectedAgent.status === "blocked" ? "bg-rose-100 text-rose-700 border border-rose-200" :
                      "bg-slate-100 text-slate-600 border border-slate-200"
                    )}>
                      {selectedAgent.status === "active" ? <Zap className="w-3 h-3" /> :
                       selectedAgent.status === "blocked" ? <AlertTriangle className="w-3 h-3" /> :
                       <Clock className="w-3 h-3" />}
                      <span className="capitalize">{selectedAgent.status}</span>
                    </div>
                  </div>

                  {selectedAgent.currentTaskId && (
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Task</div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <p className="text-sm text-slate-700 font-mono">{selectedAgent.currentTaskId}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Activity</div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-medium">Task completed</p>
                          <p className="text-xs text-slate-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-medium">Came online</p>
                          <p className="text-xs text-slate-500">5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
