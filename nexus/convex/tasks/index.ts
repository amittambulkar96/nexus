import { queryGeneric, mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const list = queryGeneric({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// Get tasks assigned to a specific agent
export const byAssignee = queryGeneric({
  args: { agentId: v.id("agents") },
  handler: async (ctx, args) => {
    const allTasks = await ctx.db.query("tasks").collect();
    return allTasks.filter((task) => 
      task.assigneeIds && task.assigneeIds.includes(args.agentId)
    );
  },
});

// Get tasks NOT yet assigned to anyone
export const unassigned = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const allTasks = await ctx.db.query("tasks").collect();
    return allTasks.filter((task) => 
      !task.assigneeIds || task.assigneeIds.length === 0
    );
  },
});

export const get = queryGeneric({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutationGeneric({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    assigneeIds: v.optional(v.array(v.id("agents"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description ?? undefined,
      status: "inbox",
      assigneeIds: args.assigneeIds ?? [],
      createdAt: now,
      updatedAt: now,
    });
    return taskId;
  },
});

export const updateStatus = mutationGeneric({
  args: {
    id: v.optional(v.id("tasks")),
    taskId: v.optional(v.id("tasks")),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    ),
  },
  handler: async (ctx, args) => {
    // Support both `id` and `taskId` for compatibility
    const taskId = args.id ?? args.taskId;
    if (!taskId) {
      throw new Error("Either 'id' or 'taskId' must be provided");
    }
    await ctx.db.patch(taskId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Assign task to an agent
export const assign = mutationGeneric({
  args: {
    taskId: v.id("tasks"),
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    
    // Add agent to assigneeIds if not already there
    const assigneeIds = task.assigneeIds || [];
    if (!assigneeIds.includes(args.agentId)) {
      assigneeIds.push(args.agentId);
    }
    
    await ctx.db.patch(args.taskId, {
      assigneeIds,
      status: "assigned",
      updatedAt: Date.now(),
    });
  },
});
