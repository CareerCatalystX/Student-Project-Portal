export async function fetchProfile() {
    if (typeof window === "undefined") {
        throw new Error("localStorage is not available on the server");
      }
    const token = localStorage.getItem("authToken"); // Retrieve token from localStorage (or sessionStorage)
  
    if (!token) {
      throw new Error("Authentication token not found");
    }
  
    const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
    if (response.status === 401) {
      throw new Error("Invalid or expired token");
    }
  
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
  
    return response.json();
  }
  