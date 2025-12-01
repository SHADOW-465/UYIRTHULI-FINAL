"use client"

import type React from "react"

import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Calendar, Activity, Users, Share2, HeartHandshake, Droplets } from "lucide-react"
import { SOSDrawer } from "./sos-drawer"

interface HomeViewProps {
  user: User
  onNavigate: (view: any) => void
}

export function HomeView({ user, onNavigate }: HomeViewProps) {
  // Mock eligibility logic if not present in DB
  const isEligible = user.donorStatus === "eligible" || true; // Default to true for demo
  const daysUntilEligible = user.daysUntilEligible || 0;


  return (
    <div className="pb-24 min-h-screen bg-slate-50/50 space-y-6">
      {/* Header */}
      <header className="bg-background pt-12 pb-6 px-6 rounded-b-[2rem] shadow-sm border-b">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Welcome back,</p>
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
          </div>
          <Button variant="ghost" size="icon" className="relative rounded-full bg-slate-100 hover:bg-slate-200">
            <Bell className="size-5 text-slate-600" />
            <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-white" />
          </Button>
        </div>
      </header>

      <div className="px-6 space-y-6">
        {/* Status Card */}
        {isEligible ? (
          <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-2 bg-white"></span>
                  </span>
                  You are eligible to donate
                </div>
                <h2 className="text-2xl font-bold leading-tight">You can save 3 lives today.</h2>
              </div>

              <Button
                size="lg"
                className="w-full bg-white text-red-600 hover:bg-red-50 hover:text-red-700 font-bold h-12 shadow-lg"
                onClick={() => onNavigate("donate")}
              >
                Donate Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden border-none shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Recovery Mode</h2>
                  <p className="text-sm text-slate-500">Next donation in {user.daysUntilEligible} days</p>
                </div>
                <div className="bg-slate-100 p-2 rounded-full">
                  <Calendar className="size-6 text-slate-500" />
                </div>
              </div>

              {/* Circular Progress Representation */}
              <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-slate-900 rounded-full"
                  style={{ width: "65%" }} // Mock progress based on days
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                <span>Last: {user.lastDonationDate}</span>
                <span>Goal: {user.nextEligibleDate}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Impact Stats - Mini Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-3">
            <div className="bg-red-100 p-2.5 rounded-xl text-red-600">
              <Droplets className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Donated</p>
              <p className="text-lg font-bold text-slate-900">{user.stats?.litersDonated || 0} L</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-3">
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
              <HeartHandshake className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Saved</p>
              <p className="text-lg font-bold text-slate-900">{user.stats?.livesSaved || 0} Lives</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-4">
            <QuickAction icon={<HeartHandshake />} label="Drives" color="text-blue-600" bg="bg-blue-50" />
            <QuickAction icon={<Activity />} label="History" color="text-emerald-600" bg="bg-emerald-50" />
            <QuickAction icon={<Share2 />} label="Refer" color="text-purple-600" bg="bg-purple-50" />
            <QuickAction icon={<Users />} label="Team" color="text-orange-600" bg="bg-orange-50" />
          </div>
        </div>

        {/* Recent Updates / Tip of the day */}
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex items-start gap-4">
          <div className="bg-indigo-100 p-2 rounded-lg shrink-0">
            <Activity className="size-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-semibold text-indigo-900 text-sm">Iron Level Tip</h4>
            <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
              Eating Vitamin C rich foods helps your body absorb iron better. Try having an orange with your meal!
            </p>
          </div>
        </div>
      </div>

      {/* SOS Button */}
      <SOSDrawer />
    </div>
  )
}

function QuickAction({
  icon,
  label,
  color,
  bg,
}: {
  icon: React.ReactNode
  label: string
  color: string
  bg: string
}) {
  return (
    <button className="flex flex-col items-center gap-2 group">
      <div
        className={`size-14 rounded-2xl flex items-center justify-center ${bg} ${color} transition-transform group-active:scale-95 shadow-sm border border-transparent group-hover:border-${color}/20`}
      >
        {/* Clone element to ensure consistent icon sizing if needed, though Lucid icons default well */}
        <div className="size-6 [&>svg]:size-full">{icon}</div>
      </div>
      <span className="text-xs font-medium text-slate-600">{label}</span>
    </button>
  )
}
