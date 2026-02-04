"use client";

import { cn } from "@/lib/utils";
import { 
  PlusCircle, 
  Edit3, 
  MessageSquare, 
  FileText, 
  UserPlus,
  ArrowRightCircle,
  CheckCircle
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
        return { icon: PlusCircle, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" };
      case "task_updated":
        return { icon: Edit3, color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" };
      case "message_sent":
        return { icon: MessageSquare, color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20" };
      case "document_created":
        return { icon: FileText, color: "text-green-500 bg-green-50 dark:bg-green-900/20" };
      case "agent_status_changed":
        return { icon: UserPlus, color: "text-orange-500 bg-orange-50 dark:bg-orange-900/20" };
      case "review_completed":
        return { icon: CheckCircle, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" };
      default:
        return { icon: ArrowRightCircle, color: "text-zinc-500 bg-zinc-50 dark:bg-zinc-800" };
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Activity Feed
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Recent
        </span>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {activities.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 dark:text-zinc-400 text-sm">
              No recent activity
            </div>
          ) : (
            activities.slice(0, 10).map((activity) => {
              const { icon: Icon, color } = getActivityIcon(activity.type);
              return (
                <div
                  key={activity._id}
                  className="flex items-start gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-900 dark:text-white leading-relaxed">
                      {activity.message}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                      {formatDate(activity.createdAt)} at {formatTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
