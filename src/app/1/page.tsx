"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../components/ui/sheet";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
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
} from "lucide-react";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";
import { TopBar } from "../../components/TopBar";
import { Sidebar } from "../../components/Sidebar";
import { StatsCards } from "../../components/StatsCards";
import { ActivityFeed } from "../../components/ActivityFeed";

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
});

interface Agent {
  _id: string;
  name: string;
  status: "active" | "idle" | "error";
  avatar?: string;
  model: string;
  tasksCompleted: number;
}

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

const mockAgents: Agent[] = [
  { _id: "1", name: "Code Reviewer", status: "active", model: "Claude 4", tasksCompleted: 127 },
  { _id: "2", name: "Test Generator", status: "idle", model: "GPT-4", tasksCompleted: 89 },
  { _id: "3", name: "Docs Writer", status: "active", model: "Claude 3.5", tasksCompleted: 45 },
  { _id: "4", name: "Bug Hunter", status: "error", model: "GPT-4 Turbo", tasksCompleted: 234 },
  { _id: "5", name: "Refactor Bot", status: "active", model: "Claude 3", tasksCompleted: 67 },
];

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

export default function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-emerald-600 bg-emerald-50";
      case "idle": return "text-slate-500 bg-slate-100";
      case "error": return "text-red-500 bg-red-50";
      case "done": return "text-emerald-600 bg-emerald-50";
      case "in_progress": return "text-amber-600 bg-amber-50";
      case "blocked": return "text-red-600 bg-red-50";
      case "todo": return "text-slate-600 bg-slate-100";
      default: return "text-slate-600 bg-slate-100";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
      case "medium": return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case "low": return <Zap className="w-3.5 h-3.5 text-blue-500" />;
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
    <div className={cn("min-h-screen bg-slate-50", dmSans.variable, jetbrainsMono.variable)}>
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300",
        sidebarCollapsed ? "w-20" : "w-72"
      )}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-semibold text-slate-900">Nexus</span>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <a href="/1" className="flex items-center gap-3 px-3 py-2.5 bg-slate-100 text-slate-900 rounded-lg font-medium">
              <LayoutDashboard className="w-5 h-5" />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </a>
            {!sidebarCollapsed && (
              <>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  <Bot className="w-5 h-5" />
                  <span>Agents</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  <FileText className="w-5 h-5" />
                  <span>Tasks</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </a>
              </>
            )}
          </nav>

          {!sidebarCollapsed && (
            <div className="p-4 border-t border-slate-100 space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Active Agents</p>
              {mockAgents.filter(a => a.status === "active").slice(0, 3).map((agent) => (
                <div key={agent._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="relative">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{agent.name}</p>
                    <p className="text-xs text-slate-400">{agent.tasksCompleted} tasks</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <ChevronRight className={cn("w-5 h-5 transition-transform", !sidebarCollapsed && "rotate-180")} />
              {!sidebarCollapsed && <span className="text-sm">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
      )}>
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">Welcome back, Alex</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Clock className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
              <p className="text-sm text-slate-500">Active Agents</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">+5%</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
              <p className="text-sm text-slate-500">In Progress</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+23%</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
              <p className="text-sm text-slate-500">Completed</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">-2</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.blocked}</p>
              <p className="text-sm text-slate-500">Blocked</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
                <p className="text-sm text-slate-500">Manage and track your agent tasks</p>
              </div>
              <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Task</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockTasks.map((task) => (
                    <tr 
                      key={task._id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-1.5 h-8 rounded-full",
                            task.status === "done" ? "bg-emerald-500" :
                            task.status === "in_progress" ? "bg-amber-500" :
                            task.status === "blocked" ? "bg-red-500" : "bg-slate-300"
                          )} />
                          <div>
                            <p className="font-medium text-slate-900">{task.title}</p>
                            <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {getPriorityIcon(task.priority)}
                          <span className="text-sm text-slate-600 capitalize">{task.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                            <Bot className="w-3.5 h-3.5 text-slate-600" />
                          </div>
                          <span className="text-sm text-slate-600">{mockAgents.find(a => a._id === task.agent)?.name || "Unassigned"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {task.dueDate || "No deadline"}
                      </td>
                      <td className="px-2">
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { agent: "Code Reviewer", action: "completed review of", target: "auth.tsx", time: "2 min ago", status: "done" },
                { agent: "Test Generator", action: "started generating tests for", target: "utils.test.ts", time: "15 min ago", status: "pending" },
                { agent: "Docs Writer", action: "updated documentation for", target: "API Endpoints", time: "1 hour ago", status: "done" },
                { agent: "Bug Hunter", action: "found critical bug in", target: "payment-worker.js", time: "2 hours ago", status: "blocked" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-slate-900">{activity.agent}</span>
                      {" "}{activity.action}{" "}
                      <span className="font-medium text-slate-700">{activity.target}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                  </div>
                  <Badge className={cn(
                    "text-xs",
                    activity.status === "done" ? "bg-emerald-50 text-emerald-700" :
                    activity.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                  )}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <SheetContent className="sm:max-w-lg bg-white border-l border-slate-200">
          <SheetHeader className="pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold text-slate-900">Task Details</SheetTitle>
              <Badge className={getStatusColor(selectedTask?.status || "")}>
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
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{selectedTask.title}</h3>
                <p className="text-slate-600">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Priority</p>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(selectedTask.priority)}
                    <span className="font-medium text-slate-900 capitalize">{selectedTask.priority}</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Due Date</p>
                  <p className="font-medium text-slate-900">{selectedTask.dueDate || "No deadline"}</p>
                </div>
              </div>

              {selectedTask.agent && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Assigned Agent</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {mockAgents.find(a => a._id === selectedTask.agent)?.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {mockAgents.find(a => a._id === selectedTask.agent)?.model}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTask.output && (
                <div className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">Agent Output</span>
                  </div>
                  <pre className="text-sm text-slate-400 font-mono whitespace-pre-wrap">
                    {selectedTask.output}
                  </pre>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  className="flex-1 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  onClick={() => console.log("Run agent")}
                >
                  <Play className="w-4 h-4" />
                  Run Agent
                </button>
                <button className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
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
