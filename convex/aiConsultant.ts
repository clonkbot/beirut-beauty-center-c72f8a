import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("aiConsultations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
    return session;
  },
});

export const createSession = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const existing = await ctx.db
      .query("aiConsultations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("aiConsultations", {
      sessionId: args.sessionId,
      userId: userId || undefined,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const addMessage = mutation({
  args: {
    sessionId: v.string(),
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("aiConsultations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!session) throw new Error("Session not found");

    const newMessage = {
      role: args.role,
      content: args.content,
      timestamp: Date.now(),
    };

    await ctx.db.patch(session._id, {
      messages: [...session.messages, newMessage],
      updatedAt: Date.now(),
    });

    return newMessage;
  },
});

export const updateRecommendations = mutation({
  args: {
    sessionId: v.string(),
    recommendedServices: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("aiConsultations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!session) throw new Error("Session not found");

    await ctx.db.patch(session._id, {
      recommendedServices: args.recommendedServices,
      updatedAt: Date.now(),
    });
  },
});
