export interface Application {
    id: string
    projectId: string
    status: "pending" | "accepted" | "rejected"
    project: {
      title: string;
    }
  }
  
  export interface UserProfile {
    id: string
    name: string
    email: string
    college: string
    year: string
    branch: string
    cvUrl: string
    createdAt: string
    updatedAt: string
    applications: Application[]
  }
  
  export interface ProfileResponse {
    message: string
    user: UserProfile
  }
  
  