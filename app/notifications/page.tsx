"use client"

import { useState } from "react"
import { NCard } from "@/components/nui"

// Placeholder type
type Notification = {
  id: string
  title: string
  message: string
  createdAt: number
  isRead: boolean
}

export default function NotificationsPage() {
  // Stubbing out notifications for now as I don't see a notifications table in convex/schema.ts
  const [notifications, setNotifications] = useState<Notification[]>([])
  const loading = false

  const handleMarkAsRead = async (id: string) => {
    // Stub
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>You have no notifications.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NCard key={notification.id} className={`p-4 ${notification.isRead ? "bg-gray-100" : "bg-white"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{notification.title}</h2>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
              </div>
            </NCard>
          ))}
        </div>
      )}
    </div>
  )
}
