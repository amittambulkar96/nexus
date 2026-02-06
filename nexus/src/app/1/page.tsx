"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
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
  MoreHorizontal,
  Activity,
  Terminal,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
  { key: "inbox", label: "Inbox", color: "#78716c" },
  { key: "in_progress", label: "In Progress", color: "#d97706" },
  { key: "review", label: "Review", color: "#0891b2" },
  { key: "done", label: "Done", color: "#059669" },
];

export default function DashboardOne() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "blocked": return "text-rose-600 bg-rose-50 border-rose-200";
      default: return "text-stone-500 bg-stone-100 border-stone-200";
    }
  };

  return (
    <div className={`${dmSans.variable} ${jetbrainsMono.variable} min-h-screen bg-white`}>
      <div className="flex h-screen">
        {/* Sidebar - Agents */}
        <aside className="w-72 border-r border-stone-200 bg-stone-50/50 flex flex-col">
          <div className="p-6 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-stone-800 rounded flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-stone-900 text-lg tracking-tight">Nexus</h1>
                <p className="text-[10px] text-stone-500 font-mono uppercase tracking-wider">Agent OS</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Agents</h2>
              <span className="text-xs text-stone-400 font-mono">{agents.length}</span>
            </div>

            <div className="space-y-1">
              {agents.map((agent) => (
                <button
                  key={agent._id}
                  onClick={() => handleAgentClick(agent)}
                  className="w-full flex items-center gap-3 p-2.5 rounded hover:bg-stone-100 transition-colors group text-left"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-stone-200 rounded flex items-center justify-center">
                      <span className="text-xs font-semibold text-stone-600">
                        {agent.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-stone-50",
                      agent.status === "active" ? "bg-emerald-500" : 
                      agent.status === "blocked" ? "bg-rose-500" : "bg-stone-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{agent.name}</p>
                    <p className="text-xs text-stone-500 truncate">{agent.role}</p>
                  </div>
                  {agent.status === "active" && (
                    <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-stone-200">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono">{agents.filter(a => a.status === "active").length} active</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-stone-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Command Center</h1>
                <p className="text-sm text-stone-500 mt-0.5">Monitor and manage your agent workforce</p>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href="/2" 
                  className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                >
                  Design 2
                </a>
                <a 
                  href="/3" 
                  className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                >
                  Design 3
                </a>
              </div>
            </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto">
            {/* Task Board */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Task Board</h2>
                <span className="text-xs text-stone-500 font-mono">{tasks.length} tasks</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {columns.map((column) => {
                  const columnTasks = getTasksByStatus(column.key);
                  
                  return (
                    <div key={column.key} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: column.color }}
                        />
                        <h3 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                          {column.label}
                        </h3>
                        <span className="text-xs text-stone-400 font-mono ml-auto">
                          {columnTasks.length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {columnTasks.map((task) => (
                          <button
                            key={task._id}
                            onClick={() => handleTaskClick(task)}
                            className="w-full text-left p-3 bg-white border border-stone-200 rounded hover:border-stone-300 hover:shadow-sm transition-all group"
                          >
                            <div className="flex items-start gap-2">
                              <div 
                                className="w-1 h-full min-h-[20px] rounded-full flex-shrink-0"
                                style={{ backgroundColor: column.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-stone-900 line-clamp-2">
                                  {task.title}
                                </p>
                                {task.assigneeIds && task.assigneeIds.length > 0 && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <div className="flex -space-x-1.5">
                                      {task.assigneeIds.slice(0, 3).map((_, i) => (
                                        <div
                                          key={i}
                                          className="w-5 h-5 rounded-full bg-stone-200 border-2 border-white flex items-center justify-center"
                                        >
                                          <span className="text-[8px] font-medium text-stone-600">
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
                          <div className="p-4 border border-dashed border-stone-200 rounded text-center">
                            <p className="text-xs text-stone-400">No tasks</p>
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
        <SheetContent className="w-[500px] bg-white border-l border-stone-200">
          {selectedTask && (
            <>
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs font-mono uppercase",
                      getStatusColor(selectedTask.status)
                    )}
                  >
                    {selectedTask.status}
                  </Badge>
                </div>
                <SheetTitle className="text-xl font-semibold text-stone-900">
                  {selectedTask.title}
                </SheetTitle>
                {selectedTask.description && (
                  <SheetDescription className="text-sm text-stone-600">
                    {selectedTask.description}
                  </SheetDescription>
                )}
              </SheetHeader>

              <Separator className="my-6" />

              <div className="space-y-6">
                {selectedTask.status === "done" && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5" />
                      Agent Output
                    </h3>
                    <div className="bg-stone-950 rounded p-4 font-mono text-xs text-stone-300 overflow-x-auto">
                      <div className="space-y-1">
                        <p><span className="text-emerald-400">$</span> task completed successfully</p>
                        <p><span className="text-stone-500">[</span><span className="text-amber-400">INFO</span><span className="text-stone-500">]</span> Processing started at {new Date(selectedTask.createdAt).toLocaleTimeString()}</p>
                        <p><span className="text-stone-500">[</span><span className="text-emerald-400">SUCCESS</span><span className="text-stone-500">]</span> All requirements met</p>
                        <p><span className="text-stone-500">[</span><span className="text-cyan-400">OUTPUT</span><span className="text-stone-500">]</span> Generated deliverable ready for review</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Created</span>
                      <span className="text-stone-900 font-mono">
                        {new Date(selectedTask.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Assignees</span>
                      <span className="text-stone-900">
                        {selectedTask.assigneeIds?.length || 0} agents
                      </span>
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
                  <div className="w-12 h-12 bg-stone-200 rounded flex items-center justify-center">
                    <span className="text-lg font-semibold text-stone-700">
                      {selectedAgent.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <SheetTitle className="text-xl font-semibold text-stone-900">
                      {selectedAgent.name}
                    </SheetTitle>
                    <p className="text-sm text-stone-500">{selectedAgent.role}</p>
                  </div>
                </div>
              </SheetHeader>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", getStatusColor(selectedAgent.status))}>
                    {getStatusIcon(selectedAgent.status)}
                    <span className="ml-1 capitalize">{selectedAgent.status}</span>
                  </Badge>
                </div>

                {selectedAgent.currentTaskId && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Current Task</h3>
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                      <p className="text-sm text-stone-700 font-mono">{selectedAgent.currentTaskId}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Activity Log</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Clock className="w-3.5 h-3.5 text-stone-400 mt-0.5" />
                      <div>
                        <p className="text-stone-900">Task completed</p>
                        <p className="text-xs text-stone-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-stone-400 mt-0.5" />
                      <div>
                        <p className="text-stone-900">Came online</p>
                        <p className="text-xs text-stone-500">5 hours ago</p>
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
