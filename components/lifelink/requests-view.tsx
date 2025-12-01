"use client"

import type React from "react"

import { useState } from "react"
import type { BloodRequest, ViewType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Navigation, Share2, CheckCircle2, Droplet } from "lucide-react"
import { toast } from "sonner"

interface RequestsViewProps {
  onNavigate: (view: ViewType) => void
}

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { getCurrentLocation, calculateDistance } from "@/lib/location"

export function RequestsView({ onNavigate }: RequestsViewProps) {
  const [activeTab, setActiveTab] = useState("all")
  const requests = useQuery(api.requests.getRequests, { filter: activeTab === "urgent" ? "Urgent" : undefined }) as unknown as BloodRequest[] || []
  const acceptRequest = useMutation(api.requests.acceptRequest)
  const [acceptedId, setAcceptedId] = useState<string | null>(null)

  const handleAccept = async (id: string) => {
    await acceptRequest({ requestId: id as any }) // Cast ID if needed
    setAcceptedId(id)
    toast.success("Donation Pledge Confirmed", {
      description: "Thank you for stepping up to save a life!",
    })
  }

  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

  // Fetch location on mount
  useState(() => {
    getCurrentLocation().then(setUserLocation).catch(console.error)
  })

  const filteredRequests = requests.filter((req) => {
    // Client side filtering for "nearby" or "all" if not handled by backend query fully
    if (activeTab === "all") return true
    if (activeTab === "urgent") return true // Already filtered by query
    if (activeTab === "nearby") {
      if (!userLocation || !req.location) return false
      const dist = calculateDistance(userLocation.lat, userLocation.lon, req.location.lat, req.location.lon)
      return dist < 10 // Within 10km
    }
    return true
  })

  if (acceptedId) {
    const acceptedRequest = requests.find((r) => r._id === acceptedId)
    if (acceptedRequest) {
      return <BloodJourney request={acceptedRequest} onBack={() => setAcceptedId(null)} />
    }
  }

  return (
    <div className="pb-24 min-h-screen bg-slate-50/50">
      <header className="bg-background sticky top-0 z-10 border-b px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">Live Requests</h1>
        <p className="text-sm text-muted-foreground">Real-time donation needs near you</p>
      </header>

      <div className="p-6 space-y-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="urgent">Urgent</TabsTrigger>
            <TabsTrigger value="nearby">Near Me</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <RequestCard key={request._id} request={request} onAccept={() => handleAccept(request._id)} />
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  )
}

function RequestCard({
  request,
  onAccept,
}: {
  request: BloodRequest
  onAccept: () => void
}) {
  const isUrgent = request.urgency === "urgent" || request.urgency === "critical"
  const isPledged = request.status === "pledged"

  return (
    <Card
      className="overflow-hidden border-l-4 border-l-transparent data-[urgent=true]:border-l-red-500 data-[pledged=true]:border-l-emerald-500 transition-all"
      data-urgent={isUrgent}
      data-pledged={isPledged}
    >
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
              <span className="text-xl font-black text-red-600">{request.bloodType}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{request.units} Units Needed</h3>
              <p className="text-sm text-muted-foreground font-medium">{request.hospitalName}</p>
            </div>
          </div>
          {isUrgent && (
            <Badge variant="destructive" className="animate-pulse shadow-red-200 shadow-lg">
              Urgent
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            <span>{request.distance} km</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            <span>{request.postedTime}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {isPledged ? (
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={onAccept}>
              <Navigation className="size-4" />
              Navigate
            </Button>
          ) : (
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-100"
              onClick={onAccept}
            >
              Accept Request
            </Button>
          )}
          <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
            <Share2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function BloodJourney({
  request,
  onBack,
}: {
  request: BloodRequest
  onBack: () => void
}) {
  const [step, setStep] = useState(1)

  return (
    <div className="pb-24 min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <span className="sr-only">Back</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>
        <h1 className="text-lg font-bold">Current Donation</h1>
      </div>

      <div className="p-6 space-y-8">
        <Card className="bg-slate-900 text-white border-none shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{request.hospitalName}</h2>
                <p className="text-slate-400 flex items-center gap-2 mt-1">
                  <MapPin className="size-4" />
                  {request.location}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <Navigation className="size-6 text-blue-400" />
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                Start Navigation
              </Button>
              <Button variant="secondary" className="flex-1 font-semibold">
                Call Hospital
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h3 className="font-bold text-lg">Donation Status</h3>

          <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-20px)] before:w-[2px] before:bg-slate-200">
            <TimelineItem
              active={step >= 1}
              completed={step > 1}
              title="Request Accepted"
              desc="You pledged to donate for this request."
              time="10:30 AM"
              icon={<CheckCircle2 className="size-5 text-white" />}
            />

            <TimelineItem
              active={step >= 2}
              completed={step > 2}
              title="On the Way"
              desc="Donor is en route to the hospital."
              action={
                step === 1 && (
                  <Button size="sm" onClick={() => setStep(2)}>
                    Mark as En Route
                  </Button>
                )
              }
              icon={<Navigation className="size-5 text-white" />}
            />

            <TimelineItem
              active={step >= 3}
              completed={step > 3}
              title="Verified at Hospital"
              desc="Scan QR code at reception to verify."
              action={
                step === 2 && (
                  <Button size="sm" onClick={() => setStep(3)}>
                    Scan QR Code
                  </Button>
                )
              }
              icon={<MapPin className="size-5 text-white" />}
            />

            <TimelineItem
              active={step >= 4}
              completed={step > 4}
              title="Donation Complete"
              desc="Thank you for saving a life!"
              action={
                step === 3 && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setStep(4)}
                  >
                    Confirm Donation
                  </Button>
                )
              }
              icon={<Droplet className="size-5 text-white" />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function TimelineItem({
  active,
  completed,
  title,
  desc,
  time,
  action,
  icon,
}: {
  active: boolean
  completed: boolean
  title: string
  desc: string
  time?: string
  action?: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <div className={`relative ${active ? "opacity-100" : "opacity-50"}`}>
      <div
        className={`absolute -left-[33px] top-0 size-6 rounded-full border-2 flex items-center justify-center transition-colors ${completed
          ? "bg-emerald-500 border-emerald-500"
          : active
            ? "bg-blue-600 border-blue-600"
            : "bg-white border-slate-300"
          }`}
      >
        {completed ? (
          <CheckCircle2 className="size-4 text-white" />
        ) : active ? (
          icon
        ) : (
          <div className="size-2 rounded-full bg-slate-300" />
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h4 className={`font-bold ${active ? "text-foreground" : "text-muted-foreground"}`}>{title}</h4>
          {time && <span className="text-xs text-muted-foreground">{time}</span>}
        </div>
        <p className="text-sm text-muted-foreground leading-snug">{desc}</p>
        {action && <div className="pt-2">{action}</div>}
      </div>
    </div>
  )
}
