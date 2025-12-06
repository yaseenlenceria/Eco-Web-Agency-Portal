import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    googleId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_googleId", (q) => q.eq("googleId", args.googleId))
      .first();

    if (existingUser) {
      // Update last login
      await ctx.db.patch(existingUser._id, { lastLogin: now });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      ...args,
      createdAt: now,
      lastLogin: now,
      role: "user",
    });

    return userId;
  },
});

export const getUserByGoogleId = query({
  args: { googleId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_googleId", (q) => q.eq("googleId", args.googleId))
      .first();

    return user;
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

export const createSession = mutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      token: args.token,
      expiresAt,
      createdAt: now,
    });

    return sessionId;
  },
});

export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) return null;

    if (session.expiresAt < Date.now()) {
      await ctx.db.delete(session._id);
      return null;
    }

    const user = await ctx.db.get(session.userId);
    return user;
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return true;
  },
});