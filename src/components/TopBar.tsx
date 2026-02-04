"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bell, Search, Calendar } from "lucide-react";

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Nexus
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
          <Calendar className="w-4 h-4" />
          {currentDate}
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          {currentTime}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-80">
          <Search className="w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search agents, tasks, activity..." 
            className="bg-transparent border-none outline-none text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 w-full"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        
        {/* User Avatar */}
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">A</span>
        </div>
      </div>
    </header>
  );
}
