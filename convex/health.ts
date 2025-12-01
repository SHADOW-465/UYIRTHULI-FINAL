import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getHealthRecords = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_identity", (q) => q.eq("identity", identity.subject))
            .unique();

        if (!user) return [];

        return await ctx.db
            .query("healthRecords")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();
    },
});

export const addHealthRecord = mutation({
    args: {
        date: v.string(),
        hemoglobin: v.number(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_identity", (q) => q.eq("identity", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        await ctx.db.insert("healthRecords", {
            userId: user._id,
            ...args,
        });
    },
});
