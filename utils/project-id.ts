export async function fetchProjectDetails(id: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/projects/${id}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch project details');
    }

    return response.json();
}
