"use client"
import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),
  // .regex(/^[a-zA-Z0-9._%+-]+@iitjammu\.ac\.in$/, "Email must belong to the iitjammu.ac.in domain"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [err, setErr] = useState("")
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const loginPromise = async () => {
      const response = await fetch("/api/auth/student/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Login failed")
      }

      return response.json()
    }

    toast.promise(loginPromise(), {
      loading: "Logging you in...",
      success: (data) => {
        router.push(`/student/verify-otp?email=${encodeURIComponent(values.email)}`)
        setIsLoading(false)
        return "OTP sent to your email. Please verify to continue."
      },
      error: (err) => {
        setErr(err.message)
        setIsLoading(false)
        return "Login failed: " + err.message
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-full bg-teal-600 text-white">
              <LogIn className="w-5 h-5" />
            </div>
            <CardTitle className="text-2xl text-teal-600">Student Login</CardTitle>
          </div>
          <CardDescription className="text-teal-600/80">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-600">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        disabled={isLoading}
                        className="border-teal-200 focus:border-teal-400 focus:ring-teal-400 bg-teal-50/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-600">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          disabled={isLoading}
                          className="border-teal-200 focus:border-teal-400 focus:ring-teal-400 bg-teal-50/50"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-teal-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" color="#00897B" />
                          ) : (
                            <Eye className="h-4 w-4" color="#00897B" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-colors flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-blue-100 pt-6">
          <div className="flex flex-col gap-2 text-sm text-teal-600/80 w-full">
            <div className="flex flex-col gap-1 lg:flex-row lg:justify-between">
              <Link
                href="/student/forgot-password"
                className="text-center hover:text-teal-700 transition-colors hover:underline"
              >
                Forgot your password?
              </Link>
              <div className="flex items-center gap-1 justify-center">
                <span>Don&apos;t have an account?</span>
                <Link
                  href="/student/signup"
                  className="text-teal-600 hover:text-teal-700 transition-colors font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
            <Link
              href="/"
              className="text-center hover:text-teal-700 transition-colors hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

