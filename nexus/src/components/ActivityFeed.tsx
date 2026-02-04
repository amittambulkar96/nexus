"use client";

import { cn } from "@/lib/utils";

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_created":
        return "📋";
      case "task_updated":
        return "✏️";
      case "message_sent":
        return "💬";
      case "document_created":
        return "📄";
      case "agent_status_changed":
        return "👤";
      default:
        return "•";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Activity Feed
      </h2>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {activities.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
              No recent activity
            </div>
          ) : (
            activities.slice(0, 10).map((activity) => (
              <div
                key={activity._id}
                className="flex items-start gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {formatTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
