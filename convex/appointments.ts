import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const bookAppointment = mutation({
    args: {
        hospitalId: v.id("users"),
        date: v.string(),
        timeSlot: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_identity", (q) => q.eq("identity", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        return await ctx.db.insert("appointments", {
            donorId: user._id,
            hospitalId: args.hospitalId,
            date: args.date,
            timeSlot: args.timeSlot,
            status: "Scheduled",
        });
    },
});

export const getAppointments = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_identity", (q) => q.eq("identity", identity.subject))
            .unique();

        if (!user) return [];

        // Return appointments where user is donor OR hospital
        const asDonor = await ctx.db
            .query("appointments")
            .withIndex("by_donor", (q) => q.eq("donorId", user._id))
            .collect();

        const asHospital = await ctx.db
            .query("appointments")
            .withIndex("by_hospital", (q) => q.eq("hospitalId", user._id))
            .collect();

        return [...asDonor, ...asHospital];
    },
});
