import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Agents table - tracks Developer, Tester, their status
  agents: defineTable({
    name: v.string(), // e.g., "Developer", "Tester"
    role: v.string(), // e.g., "Code Writer", "Quality Assurance"
    status: v.optional(v.union(v.literal("idle"), v.literal("active"), v.literal("blocked"))),
    currentTaskId: v.optional(v.id("tasks")),
    sessionKey: v.string(), // e.g., "agent:developer:main"
    lastActive: v.optional(v.number()), // timestamp
  }),

  // Tasks table - work items to be done
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("inbox"),      // New, unassigned
      v.literal("assigned"),   // Has owner(s), not started
      v.literal("in_progress"),// Being worked on
      v.literal("review"),     // Done, needs approval
      v.literal("done"),       // Finished
      v.literal("blocked")     // Stuck, needs something
    ),
    assigneeIds: v.optional(v.array(v.id("agents"))),
    createdAt: v.number(), // timestamp
    updatedAt: v.number(), // timestamp
  }),

  // Messages table - comments on tasks
  messages: defineTable({
    taskId: v.id("tasks"),
    fromAgentId: v.id("agents"),
    content: v.string(), // The comment text
    createdAt: v.number(), // timestamp
  }),

  // Activities table - real-time feed of what's happening
  activities: defineTable({
    type: v.union(
      v.literal("task_created"),
      v.literal("message_sent"),
      v.literal("document_created"),
      v.literal("task_updated"),
      v.literal("agent_status_changed")
    ),
    agentId: v.optional(v.id("agents")),
    message: v.string(), // Human-readable description
    taskId: v.optional(v.id("tasks")),
    createdAt: v.number(), // timestamp
  }),

  // Documents table - deliverables, research, protocols
  documents: defineTable({
    title: v.string(),
    content: v.optional(v.string()), // Markdown content
    type: v.union(
      v.literal("deliverable"),
      v.literal("research"),
      v.literal("protocol"),
      v.literal("note")
    ),
    taskId: v.optional(v.id("tasks")), // If attached to a task
    createdAt: v.number(), // timestamp
  }),

  // Notifications table - @mentions and alerts
  notifications: defineTable({
    mentionedAgentId: v.id("agents"),
    content: v.string(), // Notification message
    taskId: v.optional(v.id("tasks")),
    delivered: v.boolean(), // Has this been delivered?
    createdAt: v.number(), // timestamp
  }),
});
