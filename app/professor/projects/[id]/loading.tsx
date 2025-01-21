import { cn } from "@/lib/utils"; // Utility from ShadCN for combining classes

export default function Loading() {
  return (
    <div className={cn("flex h-screen items-center justify-center bg-white")}>
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-700"></div>
    </div>
  );
}