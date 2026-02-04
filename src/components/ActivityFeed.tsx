"use client";

import { cn } from "@/lib/utils";
import {
  PlusCircle,
  Edit3,
  MessageSquare,
  FileText,
  UserPlus,
  ArrowRightCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface Activity {
  _id: string;
  type: string;
  message: string;
  agentId?: string;
  taskId?: string;
  createdAt: number;
}

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_created":
        return {
          icon: PlusCircle,
          color: "#00f0ff",
          bgColor: "bg-[#00f0ff]/10",
        };
      case "task_updated":
        return {
          icon: Edit3,
          color: "#ffb800",
          bgColor: "bg-[#ffb800]/10",
        };
      case "message_sent":
        return {
          icon: MessageSquare,
          color: "#a855f7",
          bgColor: "bg-[#a855f7]/10",
        };
      case "document_created":
        return {
          icon: FileText,
          color: "#10b981",
          bgColor: "bg-[#10b981]/10",
        };
      case "agent_status_changed":
        return {
          icon: UserPlus,
          color: "#f97316",
          bgColor: "bg-[#f97316]/10",
        };
      case "review_completed":
        return {
          icon: CheckCircle2,
          color: "#10b981",
          bgColor: "bg-[#10b981]/10",
        };
      default:
        return {
          icon: ArrowRightCircle,
          color: "#6b7280",
          bgColor: "bg-[#27273a]",
        };
    }
  };

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = formatDate(activity.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Activity</h2>
        <button className="text-sm text-[#00f0ff] hover:text-[#00f0ff]/80 transition-colors">
          View all
        </button>
      </div>

      {/* Activity List */}
      <div className="bg-[#12121a] rounded-2xl border border-[#27273a] overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-8 h-8 text-[#3a3a55] mx-auto mb-3" />
            <p className="text-sm text-[#6b7280]">No recent activity</p>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            {Object.entries(groupedActivities).map(([date, dateActivities]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="sticky top-0 bg-[#12121a] px-4 py-2 border-b border-[#27273a] z-10">
                  <span className="text-xs font-mono text-[#6b7280] uppercase tracking-wider">
                    {date}
                  </span>
                </div>

                {/* Activities for this date */}
                <div className="divide-y divide-[#27273a]/50">
                  {dateActivities.map((activity) => {
                    const { icon: Icon, color, bgColor } = getActivityIcon(
                      activity.type
                    );
                    return (
                      <div
                        key={activity._id}
                        className={cn(
                          "flex items-start gap-3 p-4 hover:bg-[#0a0a0f]/50 transition-colors",
                          "group cursor-pointer"
                        )}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                            bgColor
                          )}
                        >
                          <Icon className="w-5 h-5" style={{ color }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#f0f0f5] leading-relaxed">
                            {activity.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-[#6b7280]">
                              {formatTime(activity.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Hover indicator */}
                        <div
                          className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-2"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
