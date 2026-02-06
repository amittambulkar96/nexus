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
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
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
  TrendingUp,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
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

interface TaskWithAgent extends Task {
  agentData?: { name: string; avatar?: string };
}

const mockTasks: TaskWithAgent[] = [
  { 
    _id: "1", 
    title: "Implement authentication flow", 
    status: "in_progress", 
    priority: "high",
    agent: "1",
    agentData: { name: "Code Reviewer", avatar: "CR" },
    dueDate: "Jan 15, 2024",
    description: "Add JWT-based authentication with refresh tokens for the new API endpoints.",
    output: "✓ Generated auth middleware\n✓ Implemented login handler\n✓ Added token refresh logic"
  },
  { 
    _id: "2", 
    title: "Write unit tests for utils", 
    status: "todo", 
    priority: "medium",
    agent: "2",
    agentData: { name: "Test Generator", avatar: "TG" },
    dueDate: "Jan 16, 2024",
    description: "Create comprehensive test suite for helper functions including date formatting and validation."
  },
  { 
    _id: "3", 
    title: "Update API documentation", 
    status: "done", 
    priority: "low",
    agent: "3",
    agentData: { name: "Docs Writer", avatar: "DW" },
    dueDate: "Jan 14, 2024",
    description: "Document all REST endpoints with request/response examples."
  },
  { 
    _id: "4", 
    title: "Fix memory leak in worker", 
    status: "blocked", 
    priority: "high",
    agent: "4",
    agentData: { name: "Bug Hunter", avatar: "BH" },
    dueDate: "Jan 13, 2024",
    description: "Investigate and resolve OOM issues in the background worker process."
  },
  { 
    _id: "5", 
    title: "Refactor database schema", 
    status: "todo", 
    priority: "medium",
    agent: "5",
    agentData: { name: "Refactor Bot", avatar: "RB" },
    dueDate: "Jan 18, 2024",
    description: "Normalize user tables and add proper indexes for improved query performance."
  },
];

const mockStats = [
  { label: "Total Tasks", value: "248", change: "+12%", trend: "up", icon: FileText },
  { label: "Active Agents", value: "12", change: "+3", trend: "up", icon: Bot },
  { label: "Completion Rate", value: "94%", change: "+2.4%", trend: "up", icon: TrendingUp },
  { label: "Avg. Time", value: "2.4h", change: "-0.5h", trend: "down", icon: Clock },
];

export default function DashboardPage3() {
  const [selectedTask, setSelectedTask] = useState<TaskWithAgent | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-700";
      case "idle": return "bg-slate-100 text-slate-600";
      case "error": return "bg-red-100 text-red-700";
      case "done": return "bg-blue-100 text-blue-700";
      case "in_progress": return "bg-amber-100 text-amber-700";
      case "blocked": return "bg-red-100 text-red-700";
      case "todo": return "bg-slate-100 text-slate-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 border-red-200 text-red-700";
      case "medium": return "bg-amber-50 border-amber-200 text-amber-700";
      case "low": return "bg-blue-50 border-blue-200 text-blue-700";
      default: return "bg-slate-50 border-slate-200 text-slate-600";
    }
  };

  const filteredTasks = mockTasks.filter(task => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return task.status === "in_progress" || task.status === "todo";
    if (activeTab === "completed") return task.status === "done";
    return true;
  });

  const taskCounts = {
    all: mockTasks.length,
    active: mockTasks.filter(t => t.status === "in_progress" || t.status === "todo").length,
    completed: mockTasks.filter(t => t.status === "done").length,
  };

  return (
    <div className={cn("min-h-screen bg-slate-50", inter.className)}>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">Nexus</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <a href="/3" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">Dashboard</a>
              <a href="#" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">Agents</a>
              <a href="#" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">Tasks</a>
              <a href="#" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">Analytics</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-slate-800 text-white text-sm">A</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Track your agent performance and task progress</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mockStats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  stat.trend === "up" ? "text-emerald-600" : "text-amber-600"
                )}>
                  {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
              <p className="text-sm text-slate-500">Manage and track your agent tasks</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                {(["all", "active", "completed"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize",
                      activeTab === tab 
                        ? "bg-white text-slate-900 shadow-sm" 
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {tab} ({taskCounts[tab]})
                  </button>
                ))}
              </div>
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTasks.map((task) => (
              <div 
                key={task._id} 
                className="p-5 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-1 h-12 rounded-full mt-1 flex-shrink-0",
                    task.status === "done" ? "bg-blue-500" :
                    task.status === "in_progress" ? "bg-amber-500" :
                    task.status === "blocked" ? "bg-red-500" : "bg-slate-300"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div>
                        <h3 className="font-medium text-slate-900">{task.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={cn(getStatusColor(task.status))}>
                          {task.status.replace("_", " ")}
                        </Badge>
                        <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-500">{task.dueDate}</span>
                      </div>
                      {task.agentData && (
                        <div className="flex items-center gap-1.5">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600">
                              {task.agentData.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-slate-500">{task.agentData.name}</span>
                        </div>
                      )}
                      <Badge variant="outline" className={cn("text-xs", getPriorityStyles(task.priority))}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <SheetContent className="sm:max-w-lg bg-white">
          <SheetHeader className="pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold text-slate-900">Task Details</SheetTitle>
              <Badge className={cn(getStatusColor(selectedTask?.status || ""))}>
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
                  <Badge variant="outline" className={cn(getPriorityStyles(selectedTask.priority))}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Due Date</p>
                  <p className="font-medium text-slate-900">{selectedTask.dueDate}</p>
                </div>
              </div>

              {selectedTask.agentData && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Assigned Agent</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-slate-200 text-slate-600">
                        {selectedTask.agentData.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{selectedTask.agentData.name}</p>
                      <p className="text-sm text-slate-500">AI Agent</p>
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
                <Button 
                  className="flex-1 bg-slate-900 hover:bg-slate-800" 
                  onClick={() => console.log("Run agent")}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Agent
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
