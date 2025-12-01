import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getStories = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("stories").withIndex("by_creation").order("desc").collect();
    },
});

export const createStory = mutation({
    args: {
        title: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_identity", (q) => q.eq("identity", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        await ctx.db.insert("stories", {
            authorId: user._id,
            authorName: user.name,
            title: args.title,
            content: args.content,
            likes: 0,
            createdAt: Date.now(),
        });
    },
});

export const likeStory = mutation({
    args: { storyId: v.id("stories") },
    handler: async (ctx, args) => {
        const story = await ctx.db.get(args.storyId);
        if (story) {
            await ctx.db.patch(args.storyId, { likes: story.likes + 1 });
        }
    },
});
