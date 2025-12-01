"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { User, BloodType } from "@/lib/types"
import { CheckCircle2, MapPin } from "lucide-react"

interface OnboardingProps {
  onComplete: (user: Partial<User>) => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<User>>({
    age: 25,
    gender: "male",
    bloodType: "A+",
  })

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete(formData)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
              <svg className="size-7 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-balance">Welcome to LifeLink</h1>
          <p className="text-muted-foreground text-balance">{"Join our community of life savers"}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="p-6 shadow-xl">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <p className="text-sm text-muted-foreground">{"Let's start with your basic details"}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age || ""}
                    onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value: "male" | "female" | "other") => setFormData({ ...formData, gender: value })}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="font-normal cursor-pointer">
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="font-normal cursor-pointer">
                        Female
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="font-normal cursor-pointer">
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select
                    value={formData.bloodType}
                    onValueChange={(value: BloodType) => setFormData({ ...formData, bloodType: value })}
                  >
                    <SelectTrigger id="bloodType">
                      <SelectValue placeholder="Select blood type" />
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
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">ABHA ID Integration</h2>
                <p className="text-sm text-muted-foreground">Link your Ayushman Bharat Health Account</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="abhaId">ABHA ID (Optional)</Label>
                  <Input
                    id="abhaId"
                    placeholder="1234-5678-9012-3456"
                    value={formData.abhaId || ""}
                    onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your health records will be securely linked for better tracking
                  </p>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Verify ABHA ID
                </Button>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    Benefits of linking ABHA
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                    <li>Instant health record access</li>
                    <li>Automated eligibility checking</li>
                    <li>Seamless hospital integration</li>
                    <li>Digital health passport</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Location Permission</h2>
                <p className="text-sm text-muted-foreground">Help us find nearby donation requests</p>
              </div>

              <div className="space-y-4">
                <div className="bg-primary/10 rounded-xl p-6 flex flex-col items-center text-center space-y-3">
                  <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <MapPin className="size-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Enable Location Services</h3>
                  <p className="text-sm text-muted-foreground">
                    We use your location to show nearby blood requests and donation centers. Your privacy is important
                    to us.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-medium text-sm">Why we need this:</h3>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Find emergency requests near you</li>
                    <li>Calculate distance to hospitals</li>
                    <li>Locate nearest blood banks</li>
                    <li>Connect with local donation drives</li>
                  </ul>
                </div>

                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <MapPin className="size-4" />
                  Enable Location
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1" disabled={step === 1 && !formData.name}>
            {step === totalSteps ? "Get Started" : "Continue"}
          </Button>
        </div>

        {/* Skip Option */}
        {step !== totalSteps && (
          <button
            onClick={() => onComplete(formData)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  )
}
