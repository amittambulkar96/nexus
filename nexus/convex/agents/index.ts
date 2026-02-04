import { queryGeneric, mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const list = queryGeneric({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

export const create = mutationGeneric({
  args: {
    name: v.string(),
    role: v.string(),
    sessionKey: v.string(),
  },
  handler: async (ctx, args) => {
    const agentId = await ctx.db.insert("agents", {
      name: args.name,
      role: args.role,
      sessionKey: args.sessionKey,
      status: "idle",
      lastActive: Date.now(),
    });
    return agentId;
  },
});

export const updateStatus = mutationGeneric({
  args: {
    id: v.optional(v.id("agents")),
    status: v.union(v.literal("idle"), v.literal("active"), v.literal("blocked")),
    currentTaskId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    if (!args.id) {
      throw new Error("'id' must be provided");
    }
    await ctx.db.patch(args.id, {
      status: args.status,
      currentTaskId: args.currentTaskId,
      lastActive: Date.now(),
    });
  },
});
