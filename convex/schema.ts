import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        identity: v.string(), // Clerk ID
        age: v.optional(v.number()),
        gender: v.optional(v.string()),
        bloodType: v.optional(v.string()),
        abhaId: v.optional(v.string()),
        location: v.optional(v.object({ lat: v.number(), lon: v.number() })),
        isDonor: v.boolean(),
        stats: v.object({
            litersDonated: v.number(),
            livesSaved: v.number(),
            karmaPoints: v.number(),
        }),
        badges: v.array(v.string()),
        level: v.number(),
    }).index("by_identity", ["identity"]),

    requests: defineTable({
        requesterId: v.id("users"),
        bloodType: v.string(),
        units: v.number(),
        hospitalName: v.string(),
        location: v.object({ lat: v.number(), lon: v.number() }),
        urgency: v.string(), // "Standard", "Urgent", "Critical"
        status: v.string(), // "Open", "Pledged", "Fulfilled"
        donorId: v.optional(v.id("users")),
        createdAt: v.number(),
    }).index("by_status", ["status"]),

    inventory: defineTable({
        hospitalId: v.id("users"),
        bloodType: v.string(),
        quantity: v.number(),
        status: v.string(), // "Good", "Adequate", "Low", "Critical"
    }).index("by_hospital", ["hospitalId"]),

    appointments: defineTable({
        donorId: v.id("users"),
        hospitalId: v.id("users"),
        date: v.string(),
        timeSlot: v.string(),
        status: v.string(), // "Scheduled", "Completed", "Cancelled"
    }).index("by_donor", ["donorId"]).index("by_hospital", ["hospitalId"]),

    stories: defineTable({
        authorId: v.id("users"),
        authorName: v.string(),
        title: v.string(),
        content: v.string(),
        likes: v.number(),
        createdAt: v.number(),
    }).index("by_creation", ["createdAt"]),

    healthRecords: defineTable({
        userId: v.id("users"),
        date: v.string(),
        hemoglobin: v.number(),
        notes: v.optional(v.string()),
    }).index("by_user", ["userId"]),
});
