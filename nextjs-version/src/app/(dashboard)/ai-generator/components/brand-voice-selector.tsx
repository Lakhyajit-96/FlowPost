"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MessageSquare, Lock } from "lucide-react"

interface BrandVoiceSelectorProps {
  value: string
  onChange: (value: string) => void
  userPlan: string
}

const brandVoices = [
  {
    id: "default",
    name: "Balanced",
    description: "Neutral and versatile tone",
    available: ["free", "starter", "professional", "agency"]
  },
  {
    id: "professional",
    name: "Professional",
    description: "Formal and business-focused",
    available: ["professional", "agency"]
  },
  {
    id: "conversational",
    name: "Conversational",
    description: "Friendly and approachable",
    available: ["professional", "agency"]
  },
  {
    id: "bold",
    name: "Bold & Confident",
    description: "Strong and assertive voice",
    available: ["professional", "agency"]
  },
  {
    id: "empathetic",
    name: "Empathetic",
    description: "Warm and understanding",
    available: ["agency"]
  },
  {
    id: "thought_leader",
    name: "Thought Leader",
    description: "Expert and authoritative",
    available: ["agency"]
  }
]

export function BrandVoiceSelector({ value, onChange, userPlan }: BrandVoiceSelectorProps) {
  const isAvailable = (voice: typeof brandVoices[0]) => {
    return voice.available.includes(userPlan)
  }

  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Brand Voice
        </CardTitle>
        <CardDescription className="text-sm">Choose your content personality</CardDescription>
      </CardHeader>
      <CardContent className="pb-10">
        <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-5">
          {brandVoices.map((voice) => {
            const available = isAvailable(voice)
            return (
              <div key={voice.id} className={`relative flex items-center space-x-3 rounded-md border p-5 ${!available ? 'opacity-50' : 'cursor-pointer hover:bg-accent'}`}>
                <RadioGroupItem 
                  value={voice.id} 
                  id={voice.id}
                  disabled={!available}
                />
                <Label 
                  htmlFor={voice.id} 
                  className="flex-1 cursor-pointer text-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{voice.name}</span>
                    {!available && <Lock className="h-3.5 w-3.5" />}
                  </div>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
