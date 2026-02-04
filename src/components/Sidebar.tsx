"use client";

import {
  Users,
  CheckSquare,
  Activity,
  Settings,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const menuItems = [
  { icon: Users, label: "Agents", active: true },
  { icon: CheckSquare, label: "Tasks", active: false },
  { icon: Activity, label: "Activity", active: false },
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col sticky top-0 h-screen",
        className
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
              Nexus
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Agent Dashboard
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  item.active
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm font-medium"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Settings at bottom */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all duration-200"
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
