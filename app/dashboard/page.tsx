"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { useApp } from "../AppContext"
import { kmDistance } from "@/lib/compatibility"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"
import EligibilityStatus from "@/components/EligibilityStatus"
import MyImpact from "@/components/MyImpact"
import RequestCard from "@/components/RequestCard"
import RequestCardSkeleton from "@/components/RequestCardSkeleton"
import { FileText } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

type RequestRow = {
  id: string
  blood_type: string
  rh: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  location_lat: number | null
  location_lng: number | null
  status: string
  created_at: string
  patient_name?: string
  patient_age?: number
  hospital?: string
  contact?: string
  requester_id: string
  dist?: number | null
}

export default function DashboardPage() {
  const { user } = useUser()
  const { loc, setLoc, registerLoadNearby } = useApp()
  // Mock data fetching state for now
  const isLoadingData = false
  const [requests, setRequests] = useState<RequestRow[]>([])
  const isEligibleToDonate = true
  const nextDonationDate = null

  // Stub data loading
  const loadNearby = useCallback(async () => {
     // Intentionally empty for now to fix build
  }, [])

  const fetchInitialData = useCallback(async () => {
    // Intentionally empty
  }, [])

  useEffect(() => {
    registerLoadNearby(fetchInitialData);
  }, [registerLoadNearby, fetchInitialData]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLoc(null),
      { enableHighAccuracy: true },
    )
  }, [setLoc])

  const handleAcceptRequest = async (requestId: string) => {
      // Stub
  }

  const handleDetailsRequest = (requestId: string) => {
    toast.info("Details button clicked.", { description: `This would show more details for request ID: ${requestId}` })
  }

  const requestsWithDistance = useMemo(() => {
    if (!loc) return requests
    return requests
      .map((r) => ({
        ...r,
        dist: r.location_lat && r.location_lng ? kmDistance(loc.lat, loc.lng, r.location_lat, r.location_lng) : null,
      }))
      .sort((a, b) => (a.dist ?? 1e9) - (b.dist ?? 1e9))
  }, [requests, loc])

  return (
    <div className="space-y-6">
      {/* Quick Stats & Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <EligibilityStatus eligible={isEligibleToDonate} nextDate={nextDonationDate} />
        <MyImpact />
      </div>

      {/* Nearby Requests Feed */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-dark-grey">Nearby Requests</h2>
          <button className="text-sm font-semibold text-primary-red">See All</button>
        </div>

        <div className="space-y-4">
          {isLoadingData ? (
            <>
              <RequestCardSkeleton />
              <RequestCardSkeleton />
              <RequestCardSkeleton />
            </>
          ) : requestsWithDistance.length > 0 ? (
            requestsWithDistance.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                onAccept={handleAcceptRequest}
                onDetails={handleDetailsRequest}
              />
            ))
          ) : (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-dark-grey">No Urgent Requests Nearby</h3>
                <p className="text-medium-grey mt-1">We'll notify you immediately if one appears.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
