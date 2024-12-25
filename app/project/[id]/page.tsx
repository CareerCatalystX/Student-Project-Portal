import ProjectDetails from "@/components/ProjectDetails";
import { fetchProjectDetails } from "@/utils/project-id";

interface PageProps {
    params: { id: string };
}

export default async function ApplyPage({ params }: PageProps) {
    const { id } = await params;

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
                    <h1 className="text-3xl font-bold">Project Not Found</h1>
                    <p className="text-muted-foreground mt-2">The project you are looking for does not exist.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
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
            />
        </main>
    );
}
