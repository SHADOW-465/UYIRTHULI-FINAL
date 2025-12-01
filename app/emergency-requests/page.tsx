"use client"

import Link from "next/link"
import { NBadge, NAlert, NList, NListItem } from "@/components/nui"
import { Heart, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function EmergencyRequestsPage() {
  // Use Convex query instead of Supabase
  // getRequests is defined in convex/requests.ts
  const requests = useQuery(api.requests.getRequests, { filter: "All" });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return 'error'
      case 'urgent': return 'warning' // Mapped 'high' to 'urgent' based on schema
      case 'high': return 'warning'
      case 'standard': return 'info'
      case 'medium': return 'info'
      default: return 'default'
    }
  }

  // Handle loading state: undefined means loading in Convex
  if (requests === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <p>Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#e74c3c] mb-2">All Emergency Requests</h1>
          <p className="text-gray-600">Browse all open requests and see where you can help.</p>
        </div>

        {requests.length > 0 ? (
            <NList>
                {requests.map((request) => (
                <Link href={`/emergency-requests/${request._id}`} key={request._id}>
                    <NListItem className="hover:bg-red-50 transition-colors">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <div className="flex-1 mb-2 sm:mb-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-mono text-2xl font-bold text-[#e74c3c]">
                                    {request.bloodType}
                                    </span>
                                    <NBadge variant={getUrgencyColor(request.urgency)}>
                                    {request.urgency}
                                    </NBadge>
                                </div>
                                <p className="text-sm text-gray-600">
                                    At {request.hospitalName || "Hospital"}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                                    <Clock className="w-4 h-4" />
                                    {request.createdAt ? formatDistanceToNow(request.createdAt, { addSuffix: true }) : 'Just now'}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {request.units} unit(s) needed
                                </div>
                            </div>
                        </div>
                    </NListItem>
                </Link>
                ))}
            </NList>
        ) : (
            <NAlert type="info">
            <div className="text-center py-8">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Open Requests</h3>
                <p className="text-gray-600">There are currently no open emergency requests. Thank you for your willingness to help!</p>
            </div>
            </NAlert>
        )}
      </div>
    </div>
  )
}
