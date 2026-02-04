import { queryGeneric, mutationGeneric } from "convex/server";
import { v } from "convex/values";

// Post a comment
export const create = mutationGeneric({
  args: {
    taskId: v.id("tasks"),
    fromAgentId: v.id("agents"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Post the message
    const messageId = await ctx.db.insert("messages", {
      taskId: args.taskId,
      fromAgentId: args.fromAgentId,
      content: args.content,
      createdAt: Date.now(),
    });
    
    // Auto-create notifications for @mentions
    // Extract @mentions from content (e.g., @Developer, @Tester)
    const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
    const mentions = args.content.match(mentionRegex);
    
    if (mentions) {
      // Get all agents to find mentioned ones
      const allAgents = await ctx.db.query("agents").collect();
      const mentionedNames = [...new Set(mentions.map(m => m.slice(1)))]; // Remove @ and dedup
      
      for (const name of mentionedNames) {
        const mentionedAgent = allAgents.find(a => a.name.toLowerCase() === name.toLowerCase());
        
        if (mentionedAgent) {
          await ctx.db.insert("notifications", {
            mentionedAgentId: mentionedAgent._id,
            content: args.content,
            taskId: args.taskId,
            delivered: false,
            createdAt: Date.now(),
          });
        }
      }
    }
    
    return messageId;
  },
});

// Get messages for a task
export const byTask = queryGeneric({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("taskId"), args.taskId))
      .collect();
  },
});
