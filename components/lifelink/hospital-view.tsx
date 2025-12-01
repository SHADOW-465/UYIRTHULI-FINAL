"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { MapPin, Calendar, Clock, Phone, Star, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function HospitalView() {
  // Generate next 7 days dynamically
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate().toString(),
      fullDate: d.toISOString().split('T')[0],
      available: d.getDay() !== 0 // Closed on Sundays
    };
  });

  const [selectedDate, setSelectedDate] = useState(weekDays[0].date)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Fetch inventory (mocking hospital ID for now or fetching all)
  const inventory = useQuery(api.inventory.getInventory, {}) as unknown as any[] || []
  const bookAppointment = useMutation(api.appointments.bookAppointment)

  const handleBooking = async () => {
    if (!selectedTime) {
      toast.error("Please select a time slot")
      return
    }

    // Mock hospital ID for booking
    const mockHospitalId = inventory[0]?.hospitalId;
    if (!mockHospitalId) {
      toast.error("No hospital available")
      return
    }

    await bookAppointment({
      hospitalId: mockHospitalId,
      date: selectedDate,
      timeSlot: selectedTime,
    })

    toast.success("Appointment Confirmed!", {
      description: `Scheduled for ${selectedTime} on ${weekDays.find((d) => d.date === selectedDate)?.day}, ${selectedDate}th`,
    })
  }

  return (
    <div className="pb-24 min-h-screen bg-slate-50/50">
      <header className="bg-background sticky top-0 z-10 border-b px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">Hospital & Donate</h1>
        <div className="mt-2 relative">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input placeholder="Search hospitals..." className="pl-9 bg-slate-50" />
        </div>
      </header>

      <div className="p-6 space-y-6">
        <Card className="border-none shadow-md overflow-hidden">
          <div className="h-32 bg-slate-200 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-xl font-bold">Apollo Hospital</h2>
              <p className="text-sm flex items-center gap-1 opacity-90">
                <MapPin className="size-3.5" /> Koramangala, Bangalore
              </p>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-white text-xs font-bold flex items-center gap-1">
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              4.8
            </div>
          </div>
        </Card>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="inventory">Blood Stock</TabsTrigger>
            <TabsTrigger value="book">Book Slot</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {inventory.map((item: any) => (
                <StockCard key={item._id} item={item} />
              ))}
            </div>
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="size-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">Direct Contact</h3>
                  <p className="text-sm text-blue-700 mb-2">Call blood bank directly for emergency stock inquiries.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-100 bg-transparent"
                  >
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="book" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />
                  Select Date
                </h3>
                <span className="text-xs text-muted-foreground">October 2023</span>
              </div>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-3 pb-2">
                  {weekDays.map((day) => (
                    <button
                      key={day.date}
                      disabled={!day.available}
                      onClick={() => setSelectedDate(day.date)}
                      className={`
                                        flex flex-col items-center justify-center min-w-[4.5rem] h-16 rounded-2xl border transition-all
                                        ${selectedDate === day.date
                          ? "bg-primary text-white border-primary shadow-lg shadow-red-200"
                          : "bg-white text-slate-600 border-slate-200 hover:border-red-200"
                        }
                                        ${!day.available && "opacity-50 cursor-not-allowed bg-slate-50"}
                                    `}
                    >
                      <span className="text-xs font-medium opacity-80">{day.day}</span>
                      <span className="text-lg font-bold">{day.date}</span>
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                Select Time
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                                    py-2 px-1 rounded-lg text-sm font-medium border transition-all
                                    ${selectedTime === time
                        ? "bg-primary/10 text-primary border-primary"
                        : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
                      }
                                `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                className="w-full h-12 text-lg shadow-lg shadow-red-100"
                onClick={handleBooking}
                disabled={!selectedTime}
              >
                Confirm Appointment
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                You will receive a confirmation SMS shortly.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function StockCard({ item }: { item: any }) {
  const getStatusColor = (level: string) => {
    switch (level) {
      case "good":
        return "text-emerald-600 bg-emerald-50 border-emerald-100"
      case "adequate":
        return "text-blue-600 bg-blue-50 border-blue-100"
      case "low":
        return "text-orange-600 bg-orange-50 border-orange-100"
      case "critical":
        return "text-red-600 bg-red-50 border-red-100"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  const getProgressColor = (level: string) => {
    switch (level) {
      case "good":
        return "bg-emerald-500"
      case "adequate":
        return "bg-blue-500"
      case "low":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  const getPercentage = (level: string) => {
    switch (level) {
      case "good":
        return 85
      case "adequate":
        return 60
      case "low":
        return 30
      case "critical":
        return 10
      default:
        return 0
    }
  }

  return (
    <div className={`p-3 rounded-xl border ${getStatusColor(item.stockLevel)} border opacity-90`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-2xl font-black">{item.bloodType}</span>
        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{item.stockLevel}</span>
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium opacity-90">{item.units} Units</div>
        <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${getProgressColor(item.stockLevel)}`}
            style={{ width: `${getPercentage(item.stockLevel)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
