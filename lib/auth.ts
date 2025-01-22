import { z } from 'zod';

// Student email regex pattern: YYYYxxx####@iitjammu.ac.in
const studentEmailPattern = /^\d{4}[a-z]{3}\d{4}@iitjammu\.ac\.in$/i;

const drivePattern = /^https?:\/\/(?:www\.)?drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([-\w]{25,})(?:\/view|\/preview)?(?:\?.*)?$/;

// Professor email regex pattern: firstname.lastname@iitjammu.ac.in
const professorEmailPattern = /^[a-z]+\.[a-z]+@iitjammu\.ac\.in$/i;

export const studentSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email().refine((email) => studentEmailPattern.test(email), {
    message: "Invalid student email format. Must be like '2022ume0209@iitjammu.ac.in'",
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  college: z.string().min(2, 'College name is required'),
  year: z.string(),
  branch: z.string(),
  cvUrl: z.string().url().refine((cvUrl) => drivePattern.test(cvUrl), {
    message: "Invalid Google Drive link. Please use the format 'https://drive.google.com/...'"
  }),
});

export const professorSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email().refine((email) => professorEmailPattern.test(email), {
    message: "Invalid professor email format. Must be like 'firstname.lastname@iitjammu.ac.in'",
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().min(2, 'Department is required'),
});

export const cvSchema = z.object({
  cvUrl: z.string().url().refine((cvUrl) => drivePattern.test(cvUrl), {
    message: "Invalid Google Drive link. Please use the format 'https://drive.google.com/...'"
  }),
})