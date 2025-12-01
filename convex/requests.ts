import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createRequest = mutation({
    args: {
        bloodType: v.string(),
        units: v.number(),
        hospitalName: v.string(),
        location: v.object({ lat: v.number(), lon: v.number() }),
        urgency: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }
        const user = await ctx.db
            .query("users")
            .withIndex("by_identity", (q) => q.eq("identity", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        return await ctx.db.insert("requests", {
            ...args,
            requesterId: user._id,
            status: "Open",
            createdAt: Date.now(),
        });
    },
});

export const getRequests = query({
    args: {
        filter: v.optional(v.string()), // "All", "Urgent", "My Type"
    },
    handler: async (ctx, args) => {
        let requests = await ctx.db.query("requests").withIndex("by_status", (q) => q.eq("status", "Open")).collect();

        if (args.filter === "Urgent") {
            requests = requests.filter(r => r.urgency === "Urgent" || r.urgency === "Critical");
        }

        // Note: "My Type" and "Near Me" logic would typically require more complex querying or client-side filtering
        // For now, returning all open requests or urgent ones.

        return requests.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    },
});

export const acceptRequest = mutation({
    args: {
        requestId: v.id("requests"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_identity", (q) => q.eq("identity", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(args.requestId, {
            status: "Pledged",
            donorId: user._id,
        });
    },
});

export const completeRequest = mutation({
    args: {
        requestId: v.id("requests"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const request = await ctx.db.get(args.requestId);
        if (!request || !request.donorId) throw new Error("Request invalid");

        // Update request status
        await ctx.db.patch(args.requestId, {
            status: "Fulfilled",
        });

        // Update donor stats
        const donor = await ctx.db.get(request.donorId);
        if (donor) {
            await ctx.db.patch(donor._id, {
                stats: {
                    litersDonated: (donor.stats?.litersDonated || 0) + 0.5, // Assuming 0.5L per donation
                    livesSaved: (donor.stats?.livesSaved || 0) + 3, // 1 donation saves 3 lives
                    karmaPoints: (donor.stats?.karmaPoints || 0) + 50,
                },
                level: Math.floor(((donor.stats?.karmaPoints || 0) + 50) / 100) + 1,
            });
        }
    },
});
