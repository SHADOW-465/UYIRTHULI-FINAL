import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getInventory = query({
    args: {
        hospitalId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        if (args.hospitalId) {
            return await ctx.db
                .query("inventory")
                .withIndex("by_hospital", (q) => q.eq("hospitalId", args.hospitalId!))
                .collect();
        }
        // If no hospitalId provided, could return aggregate or all (for demo)
        return await ctx.db.query("inventory").collect();
    },
});

export const updateInventory = mutation({
    args: {
        bloodType: v.string(),
        quantity: v.number(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_identity", (q) => q.eq("identity", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        // Check if item exists for this hospital and blood type
        const existingItem = await ctx.db
            .query("inventory")
            .withIndex("by_hospital", (q) => q.eq("hospitalId", user._id))
            .filter((q) => q.eq(q.field("bloodType"), args.bloodType))
            .unique();

        if (existingItem) {
            await ctx.db.patch(existingItem._id, {
                quantity: args.quantity,
                status: args.status,
            });
        } else {
            await ctx.db.insert("inventory", {
                hospitalId: user._id,
                bloodType: args.bloodType,
                quantity: args.quantity,
                status: args.status,
            });
        }
    },
});
