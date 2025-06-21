'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function EnrollmentSuccessPage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(10)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (timeLeft === 0) {
      router.push('/')
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
      setProgress(prev => (prev - 10))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, router])

  return (
    <div className="py-8 px-4 min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-teal-600" />
          </div>
          <CardTitle className="text-2xl text-teal-600">Enrollment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              You have successfully enrolled in the project. The professor will be notified of your application.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to dashboard in {timeLeft} seconds...
            </p>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="flex justify-center">
            <Button 
              onClick={() => router.push('/')}
              variant="secondary"
              className="gap-2 bg-teal-600 text-white"
            >
              Go to Dashboard Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              You will be able to view your project details and updates in your dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

