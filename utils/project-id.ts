export async function fetchProjectDetails(id: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';
    const response = await fetch(`${baseUrl}/api/projects/${id}`, {
        method: 'GET',
        credentials: 'include'
    });

     const url = `${baseUrl}/api/projects/${id}`;
    console.log('Fetching:', url);

    if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Failed to fetch project details');
    }

    return response.json();
}
