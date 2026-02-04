"use client";

import {
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
  { icon: Bot, label: "Agents", active: true },
  { icon: CheckSquare, label: "Tasks", active: false },
  { icon: Activity, label: "Activity", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-16 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col items-center py-4 gap-2 sticky top-0 h-screen",
        className
      )}
    >
      {/* Logo */}
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
        <Bot className="w-5 h-5 text-white" />
      </div>
      
      <div className="flex-1" />
      
      {menuItems.map((item) => (
        <button
          key={item.label}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative",
            item.active
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
          )}
          title={item.label}
        >
          <item.icon size={20} />
          {/* Tooltip */}
          <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 dark:bg-zinc-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {item.label}
          </span>
        </button>
      ))}
    </aside>
  );
}
