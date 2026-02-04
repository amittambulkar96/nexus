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
  { icon: Bot, label: "Agents", active: true },
  { icon: CheckSquare, label: "Tasks", active: false },
  { icon: Activity, label: "Activity", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-16 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col items-center py-4 gap-2",
        className
      )}
    >
      {menuItems.map((item) => (
        <button
          key={item.label}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
            item.active
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          )}
          title={item.label}
        >
          <item.icon size={20} />
        </button>
      ))}
    </aside>
  );
}
