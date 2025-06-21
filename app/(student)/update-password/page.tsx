"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
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
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false)
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleLogout = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setStatusMessage("Invalid token.");
    }
  }, [token]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const { newPassword } = data;

    if (!token) return;

    setIsLoading(true);
    setStatusMessage(null);
    const updatePromise = async () => {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.statusText || "Invalid / Expired token")
      }

      return data;
    }

    toast.promise(updatePromise(), {
      loading: "Updating password...",
      success: async (data) => {
        setIsUpdated(true)
        setIsLoading(false)
        await handleLogout();
        if (data.role === "PROFESSOR") {
          router.push("/professor/login");
        } else {
          router.push("/login");
        }
        return "Password updated."
      },
      error: (err) => {
        setStatusMessage(err.message)
        setIsLoading(false)
        return "Server error: " + statusMessage
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-yellow-600 px-4 py-12">
      <div className="w-full max-w-md bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-yellow-600 mb-4">Update Password</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-600">New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        required
                        className="border-yellow-600 focus:ring-yellow-600 focus:border-yellow-600 bg-yellow-50/50 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-yellow-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" color="#FDD835" />
                        ) : (
                          <Eye className="h-4 w-4" color="#FDD835" />
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
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white transition-colors flex justify-center items-center"
              disabled={isLoading || isUpdated}
            >
              {isLoading ? "Updating password..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
