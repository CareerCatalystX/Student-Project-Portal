"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { UserCheck } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/professorDashboardContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Validation schema for professor
const formSchema = z.object({
    department: z.string().min(1, "Department is required"),
    designation: z.string().min(1, "Designation is required"),
    qualification: z.string().min(1, "Qualification is required"),
    researchAreas: z.array(z.string()).min(1, "At least one research area is required"),
    officeLocation: z.string().min(1, "Office location is required"),
    officeHours: z.string().min(1, "Office hours are required"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    publications: z.string().optional(),
    websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
});

export default function UpdateProfessorProfile() {
    const { profile, loading, setIsUpdated, refreshProfile } = useAuth();
    const router = useRouter();

    // Always call useForm - this fixes the Rules of Hooks violation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            department: "",
            designation: "",
            qualification: "",
            researchAreas: [],
            officeLocation: "",
            officeHours: "",
            bio: "",
            publications: "",
            websiteUrl: "",
        },
    });

    // Update form values when profile data is available
    useEffect(() => {
        if (profile) {
            // Add a small delay to ensure Select components are mounted
            setTimeout(() => {
                const formData = {
                    department: profile.department || "",
                    designation: profile.designation || "",
                    qualification: profile.qualification || "",
                    researchAreas: Array.isArray(profile.researchAreas) ? profile.researchAreas : [],
                    officeLocation: profile.officeLocation || "",
                    officeHours: profile.officeHours || "",
                    bio: profile.bio || "",
                    publications: profile.publications || "",
                    websiteUrl: profile.websiteUrl || "",
                };

                form.reset(formData);

                // Force update each field individually as a backup
                Object.keys(formData).forEach(key => {
                    form.setValue(key as keyof typeof formData, formData[key as keyof typeof formData]);
                });
            }, 100);
        }
    }, [profile, form]);

    // Handle redirects after hooks are called
    useEffect(() => {
        if (!loading && !profile) {
            router.push("/professor/login");
        }
    }, [loading, profile, router]);

    // Show loading state
    if (loading) {
        return (
            <div className={cn("flex h-screen w-screen items-center justify-center bg-white")}>
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-700"></div>
            </div>
        );
    }

    // Show nothing while redirecting
    if (!profile) {
        return null;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UpdateProfessorProfileForm form={form} setIsUpdated={setIsUpdated} refreshProfile={refreshProfile} />
        </Suspense>
    );
}

interface UpdateProfessorProfileFormProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
    refreshProfile: () => void;
}

function UpdateProfessorProfileForm({ form, setIsUpdated, refreshProfile }: UpdateProfessorProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [researchAreaInput, setResearchAreaInput] = useState("");
    function hasValue(value: unknown): boolean {
        return value !== null && value !== '';
    }
    
    const departments = [
        "Computer Science",
        "Electrical",
        "Mathematics and Computing",
        "Mechanical",
        "Civil",
        "Chemical",
        "Material"
    ];

    const designations = [
        "Professor",
        "Associate Professor",
        "Assistant Professor",
        "Visiting Professor",
        "Professor Emeritus",
        "Adjunct Professor"
    ];

    const router = useRouter();

    // Handle adding research areas
    const addResearchArea = () => {
        if (researchAreaInput.trim()) {
            const currentAreas = form.getValues("researchAreas");
            if (!currentAreas.includes(researchAreaInput.trim())) {
                form.setValue("researchAreas", [...currentAreas, researchAreaInput.trim()]);
                setResearchAreaInput("");
            }
        }
    };

    // Handle removing research areas
    const removeResearchArea = (index: number) => {
        const currentAreas = form.getValues("researchAreas");
        form.setValue("researchAreas", currentAreas.filter((_, i) => i !== index));
    };

    // Form submission handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const cleanedValues = Object.fromEntries(
            Object.entries(values).filter(([key, value]) => {
            if (key === 'publications' || key === 'websiteUrl') {
                return hasValue(value);
            }
            return true; // Keep all required fields
            })
        );
        const updatePromise = async () => {
            const response = await fetch("/api/auth/professor/update", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cleanedValues)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Update failed");
            }
            setIsUpdated(true)
            return response.json();
        };

        toast.promise(updatePromise(), {
            loading: "Updating your profile...",
            success: () => {
                setIsLoading(false);
                refreshProfile()
                router.push("/professor/dashboard")
                return "Profile updated successfully.";
            },
            error: (err) => {
                setIsLoading(false);
                return "Update failed: " + err.message;
            },
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 px-4 py-12">
            <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-full bg-blue-600 text-white">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-2xl text-blue-600">Update Professor Details</CardTitle>
                    </div>
                    <CardDescription className="text-blue-600/80">
                        Enter your academic and professional details to enhance your profile
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Department */}
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-600">Department</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50">
                                                    <SelectValue placeholder="Select department" />
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

                            {/* Designation */}
                            <FormField
                                control={form.control}
                                name="designation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-600">Designation</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50">
                                                    <SelectValue placeholder="Select designation" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {designations.map((designation) => (
                                                    <SelectItem key={designation} value={designation}>
                                                        {designation}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Qualification */}
                            <FormField
                                control={form.control}
                                name="qualification"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-600">Qualification</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Ph.D. in Computer Science, M.Tech, etc."
                                                {...field}
                                                disabled={isLoading}
                                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Research Areas */}
                            <FormField
                                control={form.control}
                                name="researchAreas"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-600">Research Areas</FormLabel>
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Enter research area"
                                                    value={researchAreaInput}
                                                    onChange={(e) => setResearchAreaInput(e.target.value)}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addResearchArea();
                                                        }
                                                    }}
                                                    disabled={isLoading}
                                                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={addResearchArea}
                                                    disabled={isLoading}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                            {field.value.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {field.value.map((area, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                                                        >
                                                            {area}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeResearchArea(index)}
                                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Office Location */}
                            <FormField
                                control={form.control}
                                name="officeLocation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-600">Office Location</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Room 301, Academic Block A"
                                                {...field}
                                                disabled={isLoading}
                                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Office Hours */}
                            <FormField
                                control={form.control}
                                name="officeHours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-600">Office Hours</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Monday-Friday, 2:00 PM - 4:00 PM"
                                                {...field}
                                                disabled={isLoading}
                                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Bio */}
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-600">Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter your professional bio..."
                                                {...field}
                                                disabled={isLoading}
                                                rows={4}
                                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Publications */}
                            <FormField
                                control={form.control}
                                name="publications"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-600">Publications (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="List your key publications..."
                                                {...field}
                                                disabled={isLoading}
                                                rows={3}
                                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Website URL */}
                            <FormField
                                control={form.control}
                                name="websiteUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-600">Personal Website (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                placeholder="https://your-website.com"
                                                {...field}
                                                disabled={isLoading}
                                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-blue-600/70">
                                            Provide the link to your personal or academic website
                                        </FormDescription>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors flex justify-center items-center mt-6"
                                disabled={isLoading}
                            >
                                {isLoading ? "Updating Profile..." : "Update Profile"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-blue-100 pt-6">
                    <div className="text-sm text-red-600/80">
                        Provide accurate information to enhance your academic profile.
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}