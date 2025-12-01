"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { api } from "@/convex/_generated/api"
import { Onboarding } from "@/components/lifelink/onboarding"
import { HomeView } from "@/components/lifelink/home-view"
import { RequestsView } from "@/components/lifelink/requests-view"
import { HospitalView } from "@/components/lifelink/hospital-view"
import { ProfileView } from "@/components/lifelink/profile-view"
import { ImpactStories } from "@/components/lifelink/impact-stories"
import { AppShell } from "@/components/lifelink/app-shell"
import type { User, ViewType } from "@/lib/types"
import { Button } from "@/components/ui/button"

export default function LifeLinkApp() {
  const [currentView, setCurrentView] = useState<ViewType>("home")

  // Fetch user data from Convex
  const user = useQuery(api.users.getUser);

  // Determine if we need to show onboarding
  const showOnboarding = user === null; // user is null if not found in DB (but authenticated)

  return (
    <>
      <AuthLoading>
        <div className="flex h-screen w-full items-center justify-center bg-red-50">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
            <p className="text-red-600 font-medium">Loading LifeLink...</p>
          </div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white p-4 text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-600 shadow-xl">
            <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">LifeLink</h1>
          <p className="mb-8 text-gray-600">Connect, Donate, Save Lives.</p>
          <SignInButton mode="modal">
            <Button size="lg" className="w-full max-w-xs bg-red-600 hover:bg-red-700 text-lg h-12 shadow-lg shadow-red-200">
              Get Started
            </Button>
          </SignInButton>
        </div>
      </Unauthenticated>

      <Authenticated>
        {showOnboarding ? (
          <OnboardingWrapper />
        ) : (
          <AppShell currentView={currentView} onNavigate={setCurrentView}>
            {currentView === "home" && user && <HomeView user={user} onNavigate={setCurrentView} />}
            {currentView === "requests" && <RequestsView onNavigate={setCurrentView} />}
            {(currentView === "hospital" || currentView === "donate") && <HospitalView />}
            {currentView === "profile" && user && <ProfileView user={user} />}
            {currentView === "stories" && <ImpactStories />}
          </AppShell>
        )}
      </Authenticated>
    </>
  )
}

function OnboardingWrapper() {
  const createUser = useMutation(api.users.createUser);

  const handleComplete = async (data: Partial<User>) => {
    await createUser({
      name: data.name || "Anonymous",
      email: data.email || "",
      age: data.age,
      gender: data.gender,
      bloodType: data.bloodType,
      abhaId: data.abhaId,
      isDonor: true,
    });
    // After creation, the useQuery in parent will update and show AppShell
  };

  return <Onboarding onComplete={handleComplete} />;
}
