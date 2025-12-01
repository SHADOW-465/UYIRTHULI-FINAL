"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";

// Use a fallback URL if the environment variable is missing during build time.
// This allows the build to proceed, but the app won't function correctly without the real URL.
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_dummy";

export default function ConvexClientProvider({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <ClerkProvider publishableKey={clerkPublishableKey}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
