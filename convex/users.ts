import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        const user = await ctx.db
            .query("users")
            .withIndex("by_identity", (q) => q.eq("identity", identity.subject))
            .unique();
        return user;
    },
});

export const createUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        age: v.optional(v.number()),
        gender: v.optional(v.string()),
        bloodType: v.optional(v.string()),
        abhaId: v.optional(v.string()),
        location: v.optional(v.object({ lat: v.number(), lon: v.number() })),
        isDonor: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createUser without authentication present");
        }

        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_identity", (q) => q.eq("identity", identity.subject))
            .unique();

        if (existingUser) {
            return existingUser._id;
        }

        return await ctx.db.insert("users", {
            ...args,
            identity: identity.subject,
            stats: {
                litersDonated: 0,
                livesSaved: 0,
                karmaPoints: 0,
            },
            badges: [],
            level: 1,
        });
    },
});

export const updateUser = mutation({
    args: {
        id: v.id("users"),
        age: v.optional(v.number()),
        gender: v.optional(v.string()),
        bloodType: v.optional(v.string()),
        abhaId: v.optional(v.string()),
        location: v.optional(v.object({ lat: v.number(), lon: v.number() })),
        isDonor: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
    },
});
