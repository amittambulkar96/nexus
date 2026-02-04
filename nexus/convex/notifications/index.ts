import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

// Create a notification
export const create = mutationGeneric({
  args: {
    mentionedAgentId: v.id("agents"),
    content: v.string(),
    taskId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      mentionedAgentId: args.mentionedAgentId,
      content: args.content,
      taskId: args.taskId,
      delivered: false,
      createdAt: Date.now(),
    });
    return notificationId;
  },
});

// Mark notification as delivered
export const markDelivered = mutationGeneric({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { delivered: true });
  },
});

// Get pending notifications for an agent
export const pending = queryGeneric({
  args: { agentId: v.optional(v.id("agents")) },
  handler: async (ctx, args) => {
    if (args.agentId) {
      return await ctx.db
        .query("notifications")
        .filter((q) =>
          q.and(
            q.eq(q.field("mentionedAgentId"), args.agentId),
            q.eq(q.field("delivered"), false)
          )
        )
        .collect();
    }
    // If no agentId, return undelivered notifications for any agent
    return await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("delivered"), false))
      .collect();
  },
});
