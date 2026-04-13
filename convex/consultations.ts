import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    serviceInterest: v.string(),
    message: v.optional(v.string()),
    preferredContact: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    return await ctx.db.insert("consultations", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
      userId: userId || undefined,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("consultations")
      .withIndex("by_created")
      .order("desc")
      .take(50);
  },
});

export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("consultations")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});
