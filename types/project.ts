export interface ProjectFormData {
    title: string
    description: string
    duration: string
    stipend?: number
    deadline: string
    features: string[]
    department: string
  }
  
  export interface CreateProjectResponse {
    message: string
    project: {
      id: string
      title: string
      description: string
      duration: string
      stipend: number | null
      deadline: string
      features: string[]
      department: string
      closed: boolean
      professorId: string
      professorName: string
    }
  }
  
  