"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Inter } from "next/font/google";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../components/ui/sheet";
import { Badge } from "../../components/ui/badge";
import { 
  Bot, 
  Zap, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  MoreHorizontal,
  Menu,
  ChevronRight,
  Play,
  FileText,
  Bell,
  LayoutDashboard,
  Settings,
  Plus,
  Terminal,
  Sparkles,
  Crosshair,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

interface Task {
  _id: string;
  title: string;
  status: "todo" | "in_progress" | "done" | "blocked";
  priority: "low" | "medium" | "high";
  agent?: string;
  dueDate?: string;
  description?: string;
  output?: string;
}

const mockTasks: Task[] = [
  { 
    _id: "1", 
    title: "Implement authentication flow", 
    status: "in_progress", 
    priority: "high",
    agent: "1",
    dueDate: "2024-01-15",
    description: "Add JWT-based authentication with refresh tokens",
    output: "✓ Generated auth middleware\n✓ Implemented login handler\n✓ Added token refresh logic"
  },
  { 
    _id: "2", 
    title: "Write unit tests for utils", 
    status: "todo", 
    priority: "medium",
    agent: "2",
    dueDate: "2024-01-16",
    description: "Create comprehensive test suite for helper functions"
  },
  { 
    _id: "3", 
    title: "Update API documentation", 
    status: "done", 
    priority: "low",
    agent: "3",
    dueDate: "2024-01-14",
    description: "Document all REST endpoints with examples"
  },
  { 
    _id: "4", 
    title: "Fix memory leak in worker", 
    status: "blocked", 
    priority: "high",
    agent: "4",
    dueDate: "2024-01-13",
    description: "Investigate and resolve OOM issues"
  },
  { 
    _id: "5", 
    title: "Refactor database schema", 
    status: "todo", 
    priority: "medium",
    agent: "5",
    dueDate: "2024-01-18",
    description: "Normalize user tables and add indexes"
  },
];

const mockAgents = [
  { _id: "1", name: "Claude 4", status: "active", icon: Cpu, color: "from-amber-500 to-orange-600" },
  { _id: "2", name: "GPT-4", status: "idle", icon: Sparkles, color: "from-green-500 to-emerald-600" },
  { _id: "3", name: "Claude 3.5", status: "active", icon: Crosshair, color: "from-purple-500 to-violet-600" },
  { _id: "4", name: "GPT-4 Turbo", status: "error", icon: Zap, color: "from-blue-500 to-cyan-600" },
];

export default function DashboardPage2() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "idle": return "text-slate-400 bg-slate-400/10 border-slate-400/20";
      case "error": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "done": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "in_progress": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "blocked": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "todo": return "text-slate-400 bg-slate-400/10 border-slate-400/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "medium": return <Clock className="w-4 h-4 text-amber-400" />;
      case "low": return <Zap className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  const stats = {
    active: mockAgents.filter(a => a.status === "active").length,
    inProgress: mockTasks.filter(t => t.status === "in_progress").length,
    completed: mockTasks.filter(t => t.status === "done").length,
    blocked: mockTasks.filter(t => t.status === "blocked").length,
  };

  return (
    <div className={cn("min-h-screen bg-[#0a0a0f]", inter.className)}>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0a0f] to-[#0a0a0f] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />

      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-[#0f0f16] border-r border-white/5 transition-all duration-300",
        sidebarCollapsed ? "w-20" : "w-72"
      )}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-semibold text-white">Nexus</span>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <a href="/2" className="flex items-center gap-3 px-3 py-2.5 bg-white/10 text-white rounded-lg font-medium">
              <LayoutDashboard className="w-5 h-5" />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </a>
            {!sidebarCollapsed && (
              <>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                  <Bot className="w-5 h-5" />
                  <span>Agents</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                  <FileText className="w-5 h-5" />
                  <span>Tasks</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </a>
              </>
            )}
          </nav>

          {!sidebarCollapsed && (
            <div className="p-4 border-t border-white/5 space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Active Agents</p>
              {mockAgents.map((agent) => (
                <div key={agent._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br",
                    agent.color
                  )}>
                    <agent.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{agent.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{agent.status}</p>
                  </div>
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    agent.status === "active" ? "bg-emerald-400" :
                    agent.status === "idle" ? "bg-slate-500" : "bg-red-400"
                  )} />
                </div>
              ))}
            </div>
          )}

          <div className="p-4 border-t border-white/5">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
            >
              <ChevronRight className={cn("w-5 h-5 transition-transform", !sidebarCollapsed && "rotate-180")} />
              {!sidebarCollapsed && <span className="text-sm">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className={cn(
        "transition-all duration-300 relative z-10",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
      )}>
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg">
                <Menu className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">Dashboard</h1>
                <p className="text-sm text-slate-500">Welcome back, Alex</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Clock className="w-5 h-5 text-slate-400" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slate-400" />
              </button>
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#0f0f16] rounded-xl p-5 border border-white/5 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+12%</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
                <p className="text-sm text-slate-500">Active Agents</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#0f0f16] rounded-xl p-5 border border-white/5 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">+5%</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
                <p className="text-sm text-slate-500">In Progress</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#0f0f16] rounded-xl p-5 border border-white/5 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">+23%</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.completed}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#0f0f16] rounded-xl p-5 border border-white/5 hover:border-red-500/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded-full">-2</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.blocked}</p>
                <p className="text-sm text-slate-500">Blocked</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f16] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Tasks</h2>
                <p className="text-sm text-slate-500">Manage and track your agent tasks</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Task</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Agent</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Date</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockTasks.map((task) => (
                    <tr 
                      key={task._id} 
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-1 h-8 rounded-full",
                            task.status === "done" ? "bg-emerald-400" :
                            task.status === "in_progress" ? "bg-amber-400" :
                            task.status === "blocked" ? "bg-red-400" : "bg-slate-600"
                          )} />
                          <div>
                            <p className="font-medium text-white">{task.title}</p>
                            <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn("border", getStatusColor(task.status))}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {getPriorityIcon(task.priority)}
                          <span className="text-sm text-slate-300 capitalize">{task.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                            <Bot className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <span className="text-sm text-slate-400">{mockAgents.find(a => a._id === task.agent)?.name || "Unassigned"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {task.dueDate || "No deadline"}
                      </td>
                      <td className="px-2">
                        <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-slate-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <SheetContent className="sm:max-w-lg bg-[#0f0f16] border-white/10">
          <SheetHeader className="pb-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold text-white">Task Details</SheetTitle>
              <Badge className={cn("border", getStatusColor(selectedTask?.status || ""))}>
                {selectedTask?.status?.replace("_", " ")}
              </Badge>
            </div>
            <SheetDescription className="text-slate-500">
              Task ID: {selectedTask?._id}
            </SheetDescription>
          </SheetHeader>
          
          {selectedTask && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{selectedTask.title}</h3>
                <p className="text-slate-400">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Priority</p>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(selectedTask.priority)}
                    <span className="font-medium text-white capitalize">{selectedTask.priority}</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Due Date</p>
                  <p className="font-medium text-white">{selectedTask.dueDate || "No deadline"}</p>
                </div>
              </div>

              {selectedTask.output && (
                <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-medium text-indigo-300">Agent Output</span>
                  </div>
                  <pre className="text-sm text-slate-400 font-mono whitespace-pre-wrap">
                    {selectedTask.output}
                  </pre>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  onClick={() => console.log("Run agent")}
                >
                  <Play className="w-4 h-4" />
                  Run Agent
                </button>
                <button className="flex-1 px-4 py-2 border border-white/10 text-slate-300 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
