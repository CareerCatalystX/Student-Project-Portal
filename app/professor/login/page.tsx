"use client"

import { useState } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(/^[a-zA-Z0-9._%+-]+@iitjammu\.ac\.in$/, "Email must belong to the iitjammu.ac.in domain"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function LoginPage() {
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
    try {
      const response: any = await fetch("/api/auth/professor/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        setErr(`${data.error}`)
        throw new Error("Login failed")
      }

      router.push(`/professor/verify-otp?email=${encodeURIComponent(values.email)}`)
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-full bg-blue-600 text-white">
              <LogIn className="w-5 h-5" />
            </div>
            <CardTitle className="text-2xl text-blue-600">Professor Login</CardTitle>
          </div>
          <CardDescription className="text-blue-600/80">
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
                    <FormLabel className="text-blue-600">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="professor@iitjammu.ac.in"
                        {...field}
                        disabled={isLoading}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-600">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          disabled={isLoading}
                          className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-blue-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" color="#1565C0" />
                          ) : (
                            <Eye className="h-4 w-4" color="#1565C0" />
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
              {err && (
                <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                  <AlertDescription>{err}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex space-x-2 justify-center items-center">
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-blue-100 pt-6">
          <div className="flex flex-col gap-2 text-sm text-blue-600/80 w-full">
            <div className="flex flex-col gap-1 lg:flex-row lg:justify-between">
              <Link
                href="/professor/forgot-password"
                className="text-center hover:text-blue-700 transition-colors hover:underline"
              >
                Forgot your password?
              </Link>
              <div className="flex items-center gap-1 justify-center">
                <span>Don&apos;t have an account?</span>
                <Link
                  href="/professor/signup"
                  className="text-blue-600 hover:text-blue-700 transition-colors font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
            <Link
              href="/"
              className="text-center hover:text-blue-700 transition-colors hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

