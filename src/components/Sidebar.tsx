"use client";

import {
  Users,
  CheckSquare,
  Activity,
  Settings,
  Bot,
  X,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { icon: Command, label: "Dashboard", active: true },
  { icon: Users, label: "Agents", active: false },
  { icon: CheckSquare, label: "Tasks", active: false },
  { icon: Activity, label: "Activity", active: false },
];

export function Sidebar({ className, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex w-72 flex-col fixed left-0 top-0 h-screen z-40",
          "bg-[#12121a]/80 backdrop-blur-xl border-r border-[#27273a]",
          className
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-72 z-40 transform transition-transform duration-300 ease-in-out lg:hidden",
          "bg-[#12121a] border-r border-[#27273a]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#27273a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00f0ff] to-[#a855f7] rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Nexus</h1>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#27273a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#9ca3af]" />
          </button>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}

function SidebarContent() {
  return (
    <>
      {/* Logo - Desktop only */}
      <div className="hidden lg:block p-6 border-b border-[#27273a]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00f0ff] to-[#a855f7] rounded-xl flex items-center justify-center shadow-lg shadow-[#00f0ff]/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Nexus</h1>
            <p className="text-xs text-[#6b7280] font-mono">AGENT OS v2.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              item.active
                ? "bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 font-medium"
                : "text-[#9ca3af] hover:bg-[#27273a] hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(item.active && "animate-pulse")} />
            <span>{item.label}</span>
            {item.active && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00f0ff] pulse-glow" />
            )}
          </button>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="p-4 border-t border-[#27273a]">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#9ca3af] hover:bg-[#27273a] hover:text-white transition-all duration-200">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </>
  );
}
