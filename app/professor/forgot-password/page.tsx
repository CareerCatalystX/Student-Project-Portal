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

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
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

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          role: "professor", // Ensure the role is sent as "student"
        }),
      });

      if (!response.ok) {
        throw new Error("Password reset request failed");
      }

      setIsEmailSent(true); // Set the email sent flag to true on success
      setStatusMessage("Password reset link has been sent to your registered email.");
    } catch (error) {
      console.error("Error during password reset:", error);
      setStatusMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEmailSent ? (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            ) : (
              <div className="mt-2 text-center text-sm text-green-600">
                {statusMessage} {/* Success message after sending the email */}
              </div>
            )}
            {statusMessage && !isEmailSent && (
              <div className="mt-2 text-center text-sm text-red-600">
                {statusMessage} {/* Error message if there's any issue */}
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
