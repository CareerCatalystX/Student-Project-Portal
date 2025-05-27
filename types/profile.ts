// Basic skill type from the student's skills array
export interface StudentSkill {
  skill: {
    id: string
    name: string
  }
}

// Skill type from project's required skills
export interface ProjectSkill {
  skill: {
    id: string
    name: string
  }
}

// Category/catego0ry type
export interface ProjectCategory {
  id: string
  name: string
}

// College information type
export interface College {
  id: string
  name: string
  domain: string
  logo: string
  description: string
}

// Professor user information
export interface ProfessorUser {
  id: string
  name: string
  email: string
  role: string
}

// Professor type with user info
export interface Professor {
  id: string
  user: ProfessorUser
}

// Complete project information
export interface Project {
  id: string
  title: string
  description: string
  professor: Professor
  college: College
  catego0ry: ProjectCategory | null
  skills: ProjectSkill[]
}

// Individual application type
export interface Application {
  id: string
  status: "pending" | "accepted" | "rejected"
  appliedAt: string // ISO string
  project: Project
}

// Plan information from subscription
export interface Plan {
  id: string
  name: string
  price: number
  billingCycle: string
  features: string[]
}

// Individual subscription type
export interface Subscription {
  id: string
  status: string
  startedAt: string // ISO string
  endsAt: string // ISO string
  plan: Plan
}

// User profile information
export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  collegeId: string
  createdAt: string // ISO string
  updatedAt: string // ISO string
  college: College
  subscriptions: Subscription[]
}

// Complete student profile (main response type)
export interface StudentProfile {
  id: string
  userId: string
  year: number
  branch: string
  cvUrl: string
  bio: string
  gpa: number
  isUpdated: boolean
  skills: StudentSkill[]
  applications: Application[]
  user: UserProfile
}