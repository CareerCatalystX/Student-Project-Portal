import { z } from 'zod';

export const skillSchema = z.object({
  skills: z.array(z.string().min(1)).nonempty("At least one skill is required")
});

export const projectSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  duration: z.string().min(1, { message: 'Duration is required' }),
  stipend: z.number().positive({ message: 'Stipend must be a positive number' }).optional(),
  deadline: z.coerce.date({ message: 'Deadline must be a valid date' }),
  department: z.string().min(1, { message: 'Department is required' }),
  categoryName: z.string().min(1, { message: 'Category name is required' }),
  numberOfStudentsNeeded: z.number().int().positive({ message: 'Number of students must be a positive integer' }),
  preferredStudentDepartments: z.array(z.string().min(1)).min(1, { message: 'At least one preferred department is required' }),
  certification: z.boolean().optional().default(false),
  letterOfRecommendation: z.boolean().optional().default(false),
  skills: skillSchema.shape.skills,
});

export const projectIdSchema = z.string()