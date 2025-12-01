"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QrCode, Settings, Award, Droplet, Heart, Activity, Pill } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useMutation, useQuery } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

interface ProfileViewProps {
  user: User
}

export function ProfileView({ user }: ProfileViewProps) {
  const [showCard, setShowCard] = useState(false)
  const [medReminder, setMedReminder] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const updateUser = useMutation(api.users.updateUser)
  const healthRecords = useQuery(api.health.getHealthRecords) || []

  const [formData, setFormData] = useState({
    age: user.age || "",
    bloodType: user.bloodType || "",
    abhaId: user.abhaId || "",
  })

  const handleUpdate = async () => {
    try {
      await updateUser({
        id: user._id as Id<"users">,
        age: Number(formData.age),
        bloodType: formData.bloodType,
        abhaId: formData.abhaId,
      })
      setIsEditing(false)
      toast.success("Profile Updated")
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  return (
    <div className="pb-24 min-h-screen bg-slate-50/50 space-y-6">
      {/* Profile Header */}
      <header className="bg-background pt-8 pb-6 px-6 border-b flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className="size-16 rounded-full bg-red-100 flex items-center justify-center border-4 border-white shadow-md">
            <span className="text-2xl font-bold text-red-600">{user.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                Level {user.level} Donor
              </Badge>
              <span className="text-xs text-muted-foreground">{user.bloodType}</span>
            </div>
          </div>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="size-5 text-slate-400" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Update your personal information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">
                  Age
                </Label>
                <Input
                  id="age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="col-span-3"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bloodType" className="text-right">
                  Blood Type
                </Label>
                <Input
                  id="bloodType"
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="abhaId" className="text-right">
                  ABHA ID
                </Label>
                <Input
                  id="abhaId"
                  value={formData.abhaId}
                  onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdate}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="px-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Droplet />}
            value={`${user.stats?.litersDonated || 0}L`}
            label="Donated"
            color="text-red-600"
            bg="bg-red-50"
          />
          <StatCard icon={<Heart />} value={user.stats?.livesSaved || 0} label="Saved" color="text-pink-600" bg="bg-pink-50" />
          <StatCard icon={<Award />} value={user.stats?.karmaPoints || 0} label="Karma" color="text-purple-600" bg="bg-purple-50" />
        </div>

        {/* Digital ID Card Flip */}
        <div className="perspective-1000">
          <div className={`relative transition-all duration-500 transform-style-3d ${showCard ? "rotate-y-180" : ""}`}>
            {/* Front - Stats/Gamification */}
            {!showCard && (
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-24 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Current Rank</p>
                      <h3 className="text-2xl font-bold mt-1">Life Saver Elite</h3>
                    </div>
                    <Award className="size-8 text-yellow-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Next Level</span>
                      <span className="font-mono">1200 / 1500 XP</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[80%] bg-gradient-to-r from-red-500 to-yellow-500 rounded-full" />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Donate 1 more time to reach Level {user.level + 1}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-6 border-white/20 text-black hover:bg-white/10 hover:text-white bg-transparent"
                    onClick={() => setShowCard(true)}
                  >
                    Show Donor Card
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Back - QR Code ID */}
            {showCard && (
              <Card className="bg-white border-none shadow-xl overflow-hidden relative rotate-y-180">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-full flex justify-between items-center border-b pb-4">
                    <div className="text-left">
                      <h3 className="font-bold text-lg">LifeLink ID</h3>
                      <p className="text-xs text-muted-foreground">Official Donor Card</p>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {user.bloodType}
                    </Badge>
                  </div>
                  <div className="p-4 bg-white rounded-xl border-2 border-dashed border-slate-200">
                    <QrCode className="size-32 text-slate-900" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-lg font-bold tracking-widest">{user.abhaId}</p>
                    <p className="text-xs text-muted-foreground">Scan at any partner hospital</p>
                  </div>
                  <Button variant="ghost" className="w-full mt-2" onClick={() => setShowCard(false)}>
                    Flip Back
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Health Passport */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            Health Passport
          </h3>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Hemoglobin Trends</h4>
                <p className="text-2xl font-bold text-slate-900">
                  14.5 <span className="text-sm font-normal text-muted-foreground">g/dL</span>
                </p>
              </div>
              <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthRecords}>
                    <defs>
                      <linearGradient id="colorHb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E63946" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" hide />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      labelStyle={{ color: "#64748b" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="hemoglobin"
                      stroke="#E63946"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorHb)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Medication Reminder Toggle */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Pill className="size-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Daily Iron Supplements</p>
                <p className="text-xs text-muted-foreground">Get reminded at 9:00 PM</p>
              </div>
            </div>
            <Switch checked={medReminder} onCheckedChange={setMedReminder} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, value, label, color, bg }: any) {
  return (
    <div className={`flex flex-col items-center p-4 rounded-2xl ${bg} border border-transparent`}>
      <div className={`${color} mb-2 [&>svg]:size-5`}>{icon}</div>
      <span className={`text-lg font-bold ${color}`}>{value}</span>
      <span className="text-xs font-medium opacity-70 mix-blend-multiply">{label}</span>
    </div>
  )
}
