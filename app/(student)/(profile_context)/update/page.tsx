"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/dashboardContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Validation schema
const formSchema = z.object({
    year: z
        .string({ invalid_type_error: "Year must be a string" })
        .regex(/^\d{4}$/, "Year must be a valid 4-digit number"),
    branch: z.string().min(1, "Branch is required"),
    cvUrl: z.string().min(1, "CV link is required"),
    bio: z.string().min(5, "Bio is required"),
    gpa: z
        .number({ invalid_type_error: "GPA must be a number" })
        .min(0, "GPA must be at least 0")
        .max(10, "GPA must not exceed 10"),
});

export default function UpdateProfile() {
    const { profile, loading, setIsUpdated, refreshProfile } = useAuth();
    const router = useRouter();

    // Always call useForm - this fixes the Rules of Hooks violation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            year: "",
            branch: "",
            cvUrl: "",
            bio: "",
            gpa: undefined
        },
    });

    // Update form values when profile data is available
    useEffect(() => {
        if (profile) {
            // Add a small delay to ensure Select components are mounted
            setTimeout(() => {
                const formData = {
                    year: profile.year ? profile.year.toString() : "",
                    branch: profile.branch || "",
                    cvUrl: profile.cvUrl || "",
                    bio: profile.bio || "",
                    gpa: profile.gpa
                };

                form.reset(formData);

                // Force update each field individually as a backup
                form.setValue("year", formData.year);
                form.setValue("branch", formData.branch);
                form.setValue("cvUrl", formData.cvUrl);
                form.setValue("bio", formData.bio);
                form.setValue("gpa", formData.gpa);
            }, 100);
        }
    }, [profile, form]);

    // Handle redirects after hooks are called
    useEffect(() => {
        if (!loading && !profile) {
            router.push("/login");
        }
    }, [loading, profile, router]);

    // Show loading state
    if (loading) {
        return (
            <div className={cn("flex h-screen w-screen items-center justify-center bg-white")}>
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-700"></div>
            </div>
        );
    }

    // Show nothing while redirecting
    if (!profile) {
        return null;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UpdateProfileForm form={form} setIsUpdated={setIsUpdated} refreshProfile={refreshProfile} />
        </Suspense>
    );
}

interface UpdateProfileFormProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
    refreshProfile: () => void;
}

function UpdateProfileForm({ form, setIsUpdated, refreshProfile }: UpdateProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const departments = [
        "Computer Science",
        "Electrical",
        "Mathematics and Computing",
        "Mechanical",
        "Civil",
        "Chemical",
        "Material"
    ];
    const router = useRouter();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error('Please select a PDF file');
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast.error('File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
        }
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/auth/student/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.url;
    };

    // Form submission handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        const updatePromise = async () => {
            let finalCvUrl = values.cvUrl;

            // Upload file to Cloudinary if selected
            if (selectedFile) {
                setUploadingFile(true);
                try {
                    finalCvUrl = await uploadToCloudinary(selectedFile);
                } catch (error) {
                    throw new Error('Failed to upload CV file');
                } finally {
                    setUploadingFile(false);
                }
            }

            const response = await fetch("/api/auth/student/update", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    cvUrl: finalCvUrl, // Use uploaded URL or provided URL
                    year: parseInt(values.year, 10),
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Update failed");
            }
            setIsUpdated(true)
            return response.json();
        };

        toast.promise(updatePromise(), {
            loading: uploadingFile ? "Uploading CV..." : "Updating your profile...",
            success: () => {
                setIsLoading(false);
                refreshProfile();
                router.push("/")
                return "Profile updated successfully.";
            },
            error: (err) => {
                setIsLoading(false);
                return "Update failed: " + err.message;
            },
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 px-4 py-12">
            <Card className="w-full max-w-xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-full bg-teal-600 text-white">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-2xl text-teal-600">Update Student Details</CardTitle>
                    </div>
                    <CardDescription className="text-teal-600/80">
                        Enter further details to enhance your profile
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-teal-600">Bio</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your bio"
                                                    {...field}
                                                    disabled={isLoading}
                                                    className="border-teal-200 focus:border-teal-400 focus:ring-teal-400 bg-teal-50/50"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-teal-600">Graduation Year</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                }}
                                                value={field.value || undefined}
                                                disabled={isLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="border-teal-200 focus:border-teal-400 focus:ring-teal-400 bg-teal-50/50">
                                                        <SelectValue placeholder="Select graduation year" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="2023">2023</SelectItem>
                                                    <SelectItem value="2024">2024</SelectItem>
                                                    <SelectItem value="2025">2025</SelectItem>
                                                    <SelectItem value="2026">2026</SelectItem>
                                                    <SelectItem value="2027">2027</SelectItem>
                                                    <SelectItem value="2028">2028</SelectItem>
                                                    <SelectItem value="2029">2029</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="branch"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-teal-600">Branch</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={isLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="border-teal-200 focus:border-teal-400 focus:ring-teal-400 bg-teal-50/50">
                                                        <SelectValue placeholder="Select branch" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {departments.map((dept) => (
                                                        <SelectItem key={dept} value={dept}>
                                                            {dept}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cvUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-teal-600">CV</FormLabel>
                                            <div className="space-y-3">
                                                {/* File Upload Option */}
                                                <div>
                                                    <Input
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={handleFileSelect}
                                                        disabled={isLoading || uploadingFile}
                                                        className="border-teal-200 focus:border-teal-400 focus:ring-teal-400 bg-teal-50/50 h-fit my-auto py-2"
                                                    />
                                                    {selectedFile && (
                                                        <p className="text-sm text-teal-600 mt-1">
                                                            Selected: <span className="text-gray-700">{selectedFile.name}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gpa"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-teal-600">CGPA</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Enter CGPA"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(value === '' ? undefined : parseFloat(value));
                                                    }}
                                                    value={field.value || ''}
                                                    disabled={isLoading}
                                                    className="border-teal-200 focus:border-teal-400 focus:ring-teal-400 bg-teal-50/50"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-colors flex justify-center items-center mt-6"
                                    disabled={isLoading || uploadingFile}
                                >
                                    {uploadingFile ? "Uploading CV..." : isLoading ? "Updating Profile..." : "Update Profile"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-blue-100 pt-6">
                    <div className="text-sm text-red-600/80">
                        Give corrected data unless you want to be restricted from the platform.
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}