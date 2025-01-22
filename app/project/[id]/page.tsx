import ProjectDetails from "@/components/ProjectDetails";
import { fetchProjectDetails } from "@/utils/project-id";
import { AlertTriangle } from "lucide-react";

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
    const {id : id} = await params;
    let project: any = null;
    try {
        const data = await fetchProjectDetails(id);
        project = data.project;
    } catch (error) {
        console.error("Error fetching project details:", error);
    }

    if (!project) {
        return (
            <main className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                    <h1 className="text-3xl font-bold mt-4">Project Not Found</h1>
                    <p className="text-gray-600 mt-2">
                    The project you are looking for does not exist.
                    </p>
                </div>
                </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col flex-grow bg-background max-w-screen overflow-x-hidden">
            <ProjectDetails
                id={project.id}
                title={project.title}
                description={project.description}
                professorName={project.professor.name}
                deadline={project.deadline}
                duration={project.duration}
                department={project.department}
                stipend={project.stipend}
                features={project.features}
                closed={project.closed}
            />
        </main>
    );
}
