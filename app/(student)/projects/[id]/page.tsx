"use client";
import { useEffect, useState } from "react";
import ProjectDetails from "@/components/ProjectDetails";
import { AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ApplyPage() {
    const params = useParams();
    const projectId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const [project, setProject] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchProjectDetails(id: string) {
        const response = await fetch(`/api/projects/${id}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error('Failed to fetch project details');
        }

        return response.json();
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProjectDetails(projectId as string);
                setProject(data.project);
            } catch (err) {
                console.error("Error fetching project details:", err);
                setError("Failed to load project");
            } finally {
                setLoading(false);
            }
        };

        if (projectId) fetchData();
    }, [projectId]);

    if (loading) {
        return (
            <div className={cn("flex mt-64 items-center justify-center bg-white")}>
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-600"></div>
            </div>
        );
    }

    if (error || !project) {
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
                professorName={project.professor?.user?.name}
                deadline={project.deadline}
                duration={project.duration}
                department={project.department}
                stipend={project.stipend}
                skills={project.skills}
                closed={project.closed}
                category={project.catego0ry}
                numberOfStudentsNeeded={project.numberOfStudentsNeeded}
                preferredStudentDepartments={project.preferredStudentDepartments}
                letterOfRecommendation={project.letterOfRecommendation}
                certification={project.certification}
            />
        </main>
    );
}
