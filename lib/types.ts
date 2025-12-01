export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"

export interface User {
  _id: string
  name: string
  email?: string
  age?: number
  gender?: string
  bloodType?: string
  abhaId?: string
  location?: { lat: number; lon: number }
  isDonor: boolean
  stats: {
    litersDonated: number
    livesSaved: number
    karmaPoints: number
  }
  badges: string[]
  level: number
  // Derived or optional properties for UI
  donorStatus?: "eligible" | "recovery"
  daysUntilEligible?: number
  lastDonationDate?: string
  nextEligibleDate?: string
}

export interface Request {
  _id: string
  requesterId: string
  bloodType: string
  units: number
  hospitalName: string
  location: { lat: number; lon: number }
  urgency: "Standard" | "Urgent" | "Critical"
  status: "Open" | "Pledged" | "Fulfilled"
  donorId?: string
  createdAt: number
  distance?: number // Calculated on client
}

export type BloodRequest = Request;

export type ViewType = "onboarding" | "home" | "requests" | "donate" | "hospital" | "profile" | "stories"
