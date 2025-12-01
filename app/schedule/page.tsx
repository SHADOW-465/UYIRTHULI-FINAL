"use client"

import { useState } from "react"
import { NButton, NCard, NModal, NField, NBadge, NAlert, NList, NListItem } from "@/components/nui"
import { Calendar, MapPin, Clock, Users, Bell } from "lucide-react"
import { format, addDays } from "date-fns"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"

// Stub types for Convex
type Hospital = {
  id: string
  name: string
  locationLat: number
  locationLng: number
  contactPhone: string
  currentWaitTime?: number
  queueLength?: number
}

type ScheduledDonation = {
  id: string
  scheduledDate: string
  location: string
  status: string
  notes: string | null
}

export default function SchedulePage() {
  const { user } = useUser();
  // Placeholder data until we have Convex tables for hospitals/alerts/calendar
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [scheduledDonations, setScheduledDonations] = useState<ScheduledDonation[]>([])
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
    hospital_id: "",
    notes: ""
  })
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  const generateAvailableSlots = (date: Date) => {
    const slots = []
    const startHour = 8
    const endHour = 17
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(timeString)
      }
    }
    
    setAvailableSlots(slots)
  }

  const handleScheduleDonation = async () => {
      // Stub
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          setIsScheduleModalOpen(false);
      }, 500);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'info'
      case 'confirmed': return 'success'
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#e74c3c] mb-2">Schedule Donation</h1>
          <p className="text-gray-600">Book your next blood donation appointment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Available Hospitals */}
          <div className="lg:col-span-2">
            <NCard className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Available Locations
              </h2>
               {hospitals.length === 0 ? (
                  <p className="text-gray-500">No hospitals available at the moment.</p>
               ) : (
                  <div className="grid gap-4">
                    {hospitals.map((hospital) => (
                      <div key={hospital.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{hospital.name}</h3>
                            <p className="text-sm text-gray-600">{hospital.contactPhone}</p>
                          </div>
                          <NButton
                            onClick={() => {
                              setScheduleForm({ ...scheduleForm, hospital_id: hospital.id })
                              setIsScheduleModalOpen(true)
                            }}
                            size="sm"
                          >
                            Schedule
                          </NButton>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {hospital.currentWaitTime} min wait
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {hospital.queueLength} in queue
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
               )}
            </NCard>
          </div>

          {/* Upcoming Appointments */}
          <div className="lg:col-span-1">
            <NCard className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Appointments
              </h2>
              {scheduledDonations.length > 0 ? (
                <NList>
                  {scheduledDonations.map((donation) => (
                    <NListItem key={donation.id}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">
                            {format(new Date(donation.scheduledDate), "MMM dd, yyyy")}
                          </div>
                          {donation.location && (
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {donation.location}
                            </div>
                          )}
                          {donation.notes && (
                            <div className="text-sm text-gray-500 mt-1">{donation.notes}</div>
                          )}
                        </div>
                        <NBadge variant={getStatusColor(donation.status)}>
                          {donation.status}
                        </NBadge>
                      </div>
                    </NListItem>
                  ))}
                </NList>
              ) : (
                <NAlert type="info">
                  <div className="text-center py-4">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">No scheduled donations</p>
                    <p className="text-sm text-gray-500">Schedule your next donation</p>
                  </div>
                </NAlert>
              )}
            </NCard>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <NModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)}>
        <h2 className="text-xl font-semibold text-[#e74c3c] mb-4">Schedule Donation</h2>
        
        <div className="space-y-4">
          <NField
            label="Date"
            type="date"
            value={scheduleForm.date}
            onChange={(e) => {
              setScheduleForm({ ...scheduleForm, date: e.target.value })
              generateAvailableSlots(new Date(e.target.value))
            }}
            min={format(new Date(), "yyyy-MM-dd")}
            max={format(addDays(new Date(), 90), "yyyy-MM-dd")}
          />

          <NField
            label="Time"
            as="select"
            value={scheduleForm.time}
            onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
          >
            <option value="">Select time</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {format(new Date(`2000-01-01T${slot}`), "h:mm a")}
              </option>
            ))}
          </NField>

          <NField
            label="Notes (Optional)"
            as="textarea"
            value={scheduleForm.notes}
            onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
            placeholder="Any special requirements or notes..."
          />

          {scheduleForm.date && (
            <NAlert type="info">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="text-sm">
                  You'll receive reminders 24 hours and 2 hours before your appointment.
                </span>
              </div>
            </NAlert>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <NButton 
            onClick={() => setIsScheduleModalOpen(false)}
            className="bg-gray-200 text-gray-700"
          >
            Cancel
          </NButton>
          <NButton 
            onClick={handleScheduleDonation}
            disabled={loading || !scheduleForm.date || !scheduleForm.time || !scheduleForm.hospital_id}
          >
            {loading ? "Scheduling..." : "Schedule Donation"}
          </NButton>
        </div>
      </NModal>
    </div>
  )
}
