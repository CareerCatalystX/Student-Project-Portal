export interface Project {
    id: string
    title: string
    description: string
    duration: string
    stipend: number
    deadline: string
    features: string[]
    closed: boolean
  }
  
  export interface ProfessorProfile {
    id: string
    name: string
    department: string
    email: string
    createdAt: string
    updatedAt: string
    projects: Project[]
  }
  
  export interface ProfileResponse {
    message: string
    user: ProfessorProfile
  }
  
  