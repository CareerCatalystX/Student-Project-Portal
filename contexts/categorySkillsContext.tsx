import React, { createContext, useContext, useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
}

interface Skill {
  id: string
  name: string
}

interface ProjectDataContextType {
  categories: Category[]
  skills: Skill[]
  loading: boolean
  error: string | null
  refetchCategories: () => Promise<void>
  refetchSkills: () => Promise<void>
}

const ProjectDataContext = createContext<ProjectDataContextType | undefined>(undefined)

export function ProjectDataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/projects/category')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories')
    }
  }

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      if (!response.ok) {
        throw new Error('Failed to fetch skills')
      }
      const data = await response.json()
      setSkills(data.skills || [])
    } catch (err) {
      console.error('Error fetching skills:', err)
      setError('Failed to load skills')
    }
  }

  const refetchCategories = async () => {
    await fetchCategories()
  }

  const refetchSkills = async () => {
    await fetchSkills()
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        await Promise.all([fetchCategories(), fetchSkills()])
      } catch (err) {
        setError('Failed to load project data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <ProjectDataContext.Provider
      value={{
        categories,
        skills,
        loading,
        error,
        refetchCategories,
        refetchSkills,
      }}
    >
      {children}
    </ProjectDataContext.Provider>
  )
}

export function useProjectData() {
  const context = useContext(ProjectDataContext)
  if (context === undefined) {
    throw new Error('useProjectData must be used within a ProjectDataProvider')
  }
  return context
}