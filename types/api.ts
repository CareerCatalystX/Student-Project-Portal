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
  user: {
    name: string
    email: string
    college: {
      name: string
    }
  }
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

