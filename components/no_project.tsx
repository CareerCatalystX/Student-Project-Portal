import { FileWarning } from "lucide-react";

export default function NoProjects() {
  return (
    <div className="grow items-center justify-center mt-60 px-4 w-full">
      <div className="space-y-2 text-center">
        <FileWarning className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="font-semibold text-xl">No Projects Available</h3>
        <p className="text-gray-600">
          Check back soon! New research opportunities are added regularly.
        </p>
      </div>
    </div>
  );
}
