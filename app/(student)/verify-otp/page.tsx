"use client"

import React, { useState, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

const formSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
})

function VerifyOTPForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isCountdownReady, setIsCountdownReady] = useState(false)
  const [countdown, setCountdown] = useState<number>(600)
  const [err, setErr] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Sync with localStorage after hydration
    const otpStartTime = localStorage.getItem('otpStartTime');
    if (otpStartTime) {
      const timestamp = parseInt(otpStartTime);
      const elapsed = Date.now() - timestamp;
      const COUNTDOWN_DURATION = 10 * 60 * 1000; // 10 minutes

      if (elapsed < COUNTDOWN_DURATION) {
        const remaining = Math.floor((COUNTDOWN_DURATION - elapsed) / 1000);
        setCountdown(remaining);
      } else {
        localStorage.removeItem('otpStartTime');
        setCountdown(0);
      }
    } else {
      setCountdown(0); // No stored time, set to 0
    }

    setIsCountdownReady(true); // Mark as ready after calculation
  }, []);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      localStorage.removeItem('otpStartTime')
    }
  }, [countdown])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    toast.promise(
      (async () => {
        const response = await fetch("/api/auth/student/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: values.otp }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "OTP verification failed");
        }

        const data = await response.json();

        router.push("/");
        return data;
      })(),
      {
        loading: "Verifying OTP...",
        success: () => {
          localStorage.removeItem('otpStartTime')
          setIsLoading(false)
          return "OTP verified successfully! Redirecting..."
        },
        error: (err) => {
          setIsLoading(false)
          setErr(err.message); // still sets error state if you need to show in UI
          return "Verification failed: " + err.message;
        },
      }
    );
  }

  async function handleResendOTP() {
    setIsLoading(true)
    try {
      localStorage.removeItem('otpStartTime')
      router.push("/login")
    } catch (error) {
      console.error("Resend OTP error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-600">Verification Code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  className="border-teal-600 focus:ring-teal-600"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className="text-teal-500">
                Enter the 6-digit code sent to your email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-colors flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
        <div className="text-center">
          <div className="text-center text-sm text-teal-600">
            {countdown > 0
              ? `Code expires in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
              : "Code expired"
            }
          </div>
          <button
            disabled={isLoading || countdown > 0}
            onClick={handleResendOTP}
            className={`mx-auto text-xs hover:underline ${countdown > 0 ? "text-gray-400" : "text-teal-500"
              }`}
          >
            Resend verification code
          </button>
        </div>
      </form>
    </Form>
  )
}

export default function VerifyOTPPage() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Just mark as ready after hydration
    setIsReady(true)
  }, [])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            Please check your email for the verification code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            {isReady ? <VerifyOTPForm /> : <div>Loading...</div>}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
