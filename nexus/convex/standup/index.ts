import { queryGeneric } from "convex/server";

// Get standup summary data
export const get = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);
    
    // Get recent activities (last 24 hours)
    const allActivities = await ctx.db.query("activities").collect();
    const recentActivities = allActivities
      .filter(a => a.createdAt >= dayAgo)
      .sort((a, b) => a.createdAt - b.createdTime);
    
    // Get tasks
    const allTasks = await ctx.db.query("tasks").collect();
    
    // Get messages
    const allMessages = await ctx.db.query("messages").collect();
    const recentMessages = allMessages
      .filter(m => m.createdAt >= dayAgo)
      .sort((a, b) => a.createdAt - b.createdAt);
    
    // Get agents
    const allAgents = await ctx.db.query("agents").collect();
    
    return {
      activities: recentActivities,
      tasks: allTasks,
      messages: recentMessages,
      agents: allAgents,
      generatedAt: now,
    };
  },
});
