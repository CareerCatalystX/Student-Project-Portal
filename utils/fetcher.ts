export async function fetchProjects() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/projects/list`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }

    return response.json();
}
