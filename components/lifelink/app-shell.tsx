"use client"

import type React from "react"

import type { ViewType } from "@/lib/types"
import { Home, Navigation, Heart, User, PlusCircle } from "lucide-react"
import { SOSDrawer } from "./sos-drawer"

interface AppShellProps {
  children: React.ReactNode
  currentView: ViewType
  onNavigate: (view: ViewType) => void
}

export function AppShell({ children, currentView, onNavigate }: AppShellProps) {
  // Don't show nav on onboarding
  if (currentView === "onboarding") return <>{children}</>

  return (
    <div className="relative min-h-screen bg-background">
      <main className="pb-safe">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 pb-safe pt-2 px-2">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          <NavItem icon={<Home />} label="Home" isActive={currentView === "home"} onClick={() => onNavigate("home")} />
          <NavItem
            icon={<Navigation />}
            label="Requests"
            isActive={currentView === "requests"}
            onClick={() => onNavigate("requests")}
          />

          {/* Center Action Button */}
          <div className="relative -top-6">
            <SOSDrawer
              trigger={
                <button
                  className="size-14 bg-primary rounded-full shadow-xl flex items-center justify-center text-white border-4 border-white hover:scale-105 transition-transform"
                >
                  <PlusCircle className="size-8" />
                </button>
              }
            />
          </div>

          <NavItem
            icon={<Heart />}
            label="Hospital"
            isActive={currentView === "hospital"}
            onClick={() => onNavigate("hospital")}
          />
          <NavItem
            icon={<User />}
            label="Profile"
            isActive={currentView === "profile"}
            onClick={() => onNavigate("profile")}
          />
          <NavItem
            icon={<Heart className="text-pink-500" />} // Differentiate icon
            label="Stories"
            isActive={currentView === "stories"}
            onClick={() => onNavigate("stories")}
          />
        </div>
      </nav>
    </div>
  )
}

function NavItem({ icon, label, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? "text-primary" : "text-slate-400 hover:text-slate-600"
        }`}
    >
      <div className="[&>svg]:size-6">{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}
