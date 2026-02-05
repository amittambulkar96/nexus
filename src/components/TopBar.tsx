"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bell, Search, Menu, Plus } from "lucide-react";

interface TopBarProps {
  className?: string;
  onMenuClick?: () => void;
}

export function TopBar({ className, onMenuClick }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
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
        "sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4",
        "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#27273a]",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-[#27273a] rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-[#9ca3af]" />
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#12121a] border border-[#27273a] rounded-xl w-64 lg:w-80 focus-within:border-[#00f0ff]/50 transition-colors">
          <Search className="w-4 h-4 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search agents, tasks..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[#6b7280] w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* DateTime */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm text-white font-mono">{currentTime}</span>
          <span className="text-xs text-[#6b7280]">{currentDate}</span>
        </div>

        {/* Add button */}
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#00f0ff] text-[#0a0a0f] rounded-xl font-semibold text-sm hover:bg-[#00f0ff]/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Task
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 hover:bg-[#27273a] rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-[#9ca3af]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f43f5e] rounded-full pulse-glow" />
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#00f0ff] to-[#a855f7] rounded-xl flex items-center justify-center shadow-lg shadow-[#00f0ff]/20">
          <span className="text-white font-bold text-sm">A</span>
        </div>
      </div>
    </header>
  );
}
