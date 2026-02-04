import { queryGeneric, mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const log = mutationGeneric({
  args: {
    type: v.union(
      v.literal("task_created"),
      v.literal("task_completed"),
      v.literal("review_completed"),
      v.literal("message_sent"),
      v.literal("document_created"),
      v.literal("task_updated"),
      v.literal("agent_status_changed")
    ),
    agentId: v.optional(v.id("agents")),
    message: v.string(),
    taskId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const activityId = await ctx.db.insert("activities", {
      type: args.type,
      agentId: args.agentId,
      message: args.message,
      taskId: args.taskId,
      createdAt: Date.now(),
    });
    return activityId;
  },
});

export const recent = queryGeneric({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("activities").collect();
    const sorted = all.sort((a, b) => b._creationTime - a._creationTime);
    return args.limit ? sorted.slice(0, args.limit) : sorted;
  },
});
