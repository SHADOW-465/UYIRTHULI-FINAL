"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Send } from "lucide-react"
import { toast } from "sonner"

export function ImpactStories() {
    const stories = useQuery(api.stories.getStories) || []
    const createStory = useMutation(api.stories.createStory)
    const likeStory = useMutation(api.stories.likeStory)

    const [newStory, setNewStory] = useState({ title: "", content: "" })
    const [isPosting, setIsPosting] = useState(false)

    const handlePost = async () => {
        if (!newStory.title || !newStory.content) return
        setIsPosting(true)
        await createStory(newStory)
        setNewStory({ title: "", content: "" })
        setIsPosting(false)
        toast.success("Story Shared!", { description: "Your impact story is now live." })
    }

    return (
        <div className="space-y-6 pb-24">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Impact Stories</h2>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Share your journey</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Title (e.g., My First Donation)"
                            value={newStory.title}
                            onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                        />
                        <Textarea
                            placeholder="Tell us about your experience..."
                            value={newStory.content}
                            onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                        />
                        <Button onClick={handlePost} disabled={isPosting || !newStory.title} className="w-full">
                            <Send className="mr-2 size-4" /> Share Story
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                {stories.map((story: any) => (
                    <Card key={story._id}>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{story.authorName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{story.authorName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(story.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{story.title}</h3>
                                <p className="text-muted-foreground mt-1">{story.content}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => likeStory({ storyId: story._id })}
                                >
                                    <Heart className={`mr-1 size-4 ${story.likes > 0 ? "fill-current" : ""}`} />
                                    {story.likes} Likes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
