import { z } from 'zod';

const cloudinaryPattern = /^https:\/\/res\.cloudinary\.com\//;

export const studentSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const studentSigninSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const professorSigninSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const verifyOTPSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().min(6, 'OTP must be at least 6 characters'),
})

export const completeProfileSchema = z.object({
  year: z.number().min(2000, 'Study year is required'),
  branch: z.string().min(1, 'Branch/department is required'),
  cvUrl: z.string().url().refine((cvUrl) => cloudinaryPattern.test(cvUrl), {
    message: "Unable to upload. Contact: support@carrercatalystx.com"
  }),
  bio: z.string().min(5, 'Bio is required Min(5 Ch.)'),
  gpa: z.number().refine((val) =>
    val >= 0 &&
    val <= 10 &&
    Number(val.toFixed(2)) === val,
    {
      message: "GPA must be between 0 and 10 with up to 2 decimal places",
    }
  )
});

export const completeProfessorProfileSchema = z.object({
  department: z.string().min(1, 'Branch/department is required'),
  designation: z.string().min(1, 'Designation is required'),
  qualification: z.string().min(1, 'Qualification is optional').optional(),
  researchAreas: z.array(z.string().min(1, 'Mention your Research Areas')),
  officeLocation: z.string().min(1, 'Office Location is optional').optional(),
  officeHours: z.string().min(1, 'Office Hours is optional').optional(),
  bio: z.string().min(1, 'Bio is optional').optional(),
  publications: z.string().min(1, 'Publications is optional').optional(),
  websiteUrl: z.string().min(1, 'Website Url is optional').optional(),
})

export const professorSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const resetPassword = z.object({
  email: z.string().email('Please enter a valid email address')
})

export const updatePassword = z.object({
  token: z.string().length(64).regex(/^[a-f0-9]+$/, 'Invalid hex string'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
})