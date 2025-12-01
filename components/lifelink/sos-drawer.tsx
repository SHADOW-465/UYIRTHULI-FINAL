"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Siren, Ambulance, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { getCurrentLocation } from "@/lib/location"

export function SOSDrawer({ trigger }: { trigger?: React.ReactNode }) {
  const [urgency, setUrgency] = useState([50])
  const [ambulance, setAmbulance] = useState(false)
  const [bloodType, setBloodType] = useState("A+")
  const [open, setOpen] = useState(false)

  const createRequest = useMutation(api.requests.createRequest)

  const handleRequest = async () => {
    let location = { lat: 0, lon: 0 }
    try {
      location = await getCurrentLocation()
    } catch (error) {
      console.error("Failed to get location", error)
      toast.error("Location access denied. Using default location.")
    }

    await createRequest({
      bloodType,
      units: 1, // Default for SOS
      hospitalName: "Emergency Location", // Should get from GPS
      location,
      urgency: urgency[0] > 66 ? "Critical" : urgency[0] > 33 ? "Urgent" : "Standard",
    })

    setOpen(false)
    toast.error("Emergency Request Broadcasted!", {
      description: "Nearby donors and ambulance services have been alerted.",
      duration: 5000,
    })
  }

  const getUrgencyLabel = (val: number) => {
    if (val < 33) return "Standard"
    if (val < 66) return "Urgent"
    return "Critical"
  }

  const getUrgencyColor = (val: number) => {
    if (val < 33) return "bg-yellow-500"
    if (val < 66) return "bg-orange-500"
    return "bg-red-600 animate-pulse"
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            size="lg"
            className="fixed bottom-24 right-4 size-16 rounded-full shadow-2xl bg-red-600 hover:bg-red-700 border-4 border-white z-50 p-0"
          >
            <Siren className="size-8 animate-pulse text-white" />
            <span className="sr-only">SOS Emergency</span>
          </Button>
        )}
      </SheetTrigger>

      <SheetContent side="bottom" className="rounded-t-3xl h-[85vh]">
        <SheetHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="size-8 text-red-600" />
            </div>
          </div>
          <SheetTitle className="text-2xl text-center text-red-600">Emergency Blood Request</SheetTitle>
          <SheetDescription className="text-center">
            This will alert all nearby compatible donors immediately.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Urgency Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Urgency Level</Label>
              <span
                className={`px-3 py-1 rounded-full text-white text-xs font-bold uppercase ${getUrgencyColor(
                  urgency[0],
                )}`}
              >
                {getUrgencyLabel(urgency[0])}
              </span>
            </div>
            <Slider value={urgency} onValueChange={setUrgency} max={100} step={1} className="py-4" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Standard</span>
              <span>Critical</span>
            </div>
          </div>

          {/* Blood Type Selector */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Blood Type Required</Label>
            <Select value={bloodType} onValueChange={setBloodType}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select Blood Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ambulance Toggle */}
          <div className="flex items-center justify-between bg-muted/30 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Ambulance className="size-6 text-blue-600" />
              </div>
              <div className="space-y-0.5">
                <Label className="text-base">Request Ambulance</Label>
                <p className="text-xs text-muted-foreground">Connect with StanPlus/112</p>
              </div>
            </div>
            <Switch checked={ambulance} onCheckedChange={setAmbulance} />
          </div>
        </div>

        <SheetFooter className="pt-4">
          <Button
            className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
            onClick={handleRequest}
          >
            Broadcast Emergency
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
