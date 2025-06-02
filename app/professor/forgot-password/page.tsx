"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
  // .regex(/^[a-zA-Z0-9._%+-]+@iitjammu\.ac\.in$/, "Email must belong to the iitjammu.ac.in domain"),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false); // Track if the email was sent successfully
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setStatusMessage(null); // Reset the message before making the request
    setIsEmailSent(false); // Reset the email sent flag

    const forgotPromise = async () => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Login failed")
      }

      return response.json()
    }

    toast.promise(forgotPromise(), {
      loading: "Sending you reset password link...",
      success: (data) => {
        setIsLoading(false);
          setIsEmailSent(true);
        return "Resent password link sent to registered email."
      },
      error: (err) => {
        setStatusMessage(err.message)
        setIsLoading(false)
        return "Server error: " + err.message
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-500 px-4 py-12">
      <div className="w-full max-w-md bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Forgot Password</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-600">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="border-blue-600 focus:ring-blue-600 focus:border-blue-600 bg-blue-50/50 pr-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors flex justify-center items-center"
              disabled={isLoading || isEmailSent}
            >
              {isLoading ? "Sending reset link..." : "Send reset link"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
