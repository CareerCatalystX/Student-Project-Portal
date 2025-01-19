"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { Eye, EyeOff, UserPlus } from 'lucide-react'
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .regex(/^[a-zA-Z0-9._%+-]+@iitjammu\.ac\.in$/, "Email must belong to the iitjammu.ac.in domain"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  department: z.string().min(1, "Department is required"),
})

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      department: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setMessage(null)
    try {
      const response = await fetch("/api/auth/professor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(data.message)
        router.push(`/professor/verify-otp?email=${encodeURIComponent(values.email)}`)
      } else {
        const data = await response.json()
        setError(data.error || "Signup failed.")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-12">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-full bg-blue-600 text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <CardTitle className="text-2xl text-blue-600">Create Professor Account</CardTitle>
          </div>
          <CardDescription className="text-blue-600/80">
            Enter your information to create your professor account at IIT Jammu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-600">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Dr. John Doe" 
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
              </div>

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
                          placeholder="Create a strong password"
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
                    <FormDescription className="text-blue-600/70">
                      Password must be at least 6 characters and include uppercase, lowercase,
                      and numbers
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-600">Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Mathematics and Computing">Mathematics and Computing</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="Chemical">Chemical</SelectItem>
                        <SelectItem value="Material">Material</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {message && (
                <Alert className="bg-green-50 text-green-600 border-green-200">
                  <AlertDescription>{message}</AlertDescription>
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
                                "Create Account"
                              )}
                            </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-blue-100 pt-6">
          <div className="text-sm text-blue-600/80">
            Already have an account?{" "}
            <Link
              href="/professor/login"
              className="text-blue-600 hover:text-blue-700 transition-colors font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

