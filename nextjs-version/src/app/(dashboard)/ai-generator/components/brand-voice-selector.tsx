"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Lock } from "lucide-react"

interface BrandVoiceSelectorProps {
  value: string
  onChange: (value: string) => void
  userPlan: string
}

const brandVoices = [
  {
    id: "default",
    name: "Default",
    description: "Standard AI voice",
    available: ["free", "starter", "professional", "agency"]
  },
  {
    id: "professional",
    name: "Professional",
    description: "Formal and business-focused",
    available: ["professional", "agency"]
  },
  {
    id: "casual",
    name: "Casual & Friendly",
    description: "Relaxed and approachable",
    available: ["professional", "agency"]
  },
  {
    id: "enthusiastic",
    name: "Enthusiastic",
    description: "Energetic and exciting",
    available: ["professional", "agency"]
  },
  {
    id: "authoritative",
    name: "Authoritative",
    description: "Expert and confident",
    available: ["agency"]
  },
  {
    id: "storyteller",
    name: "Storyteller",
    description: "Narrative and engaging",
    available: ["agency"]
  }
]

export function BrandVoiceSelector({ value, onChange, userPlan }: BrandVoiceSelectorProps) {
  const isAvailable = (voice: typeof brandVoices[0]) => {
    return voice.available.includes(userPlan)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Brand Voice
        </CardTitle>
        <CardDescription>Choose your content personality</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
          {brandVoices.map((voice) => {
            const available = isAvailable(voice)
            return (
              <div key={voice.id} className="flex items-start space-x-3">
                <RadioGroupItem 
                  value={voice.id} 
                  id={voice.id}
                  disabled={!available}
                  className="mt-1"
                />
                <Label 
                  htmlFor={voice.id} 
                  className={`flex-1 cursor-pointer ${!available ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{voice.name}</span>
                    {!available && <Lock className="h-3 w-3" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{voice.description}</p>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
