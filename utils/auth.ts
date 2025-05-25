// lib/auth.ts
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getServerProfile() {
  try {
    const cookieStore = cookies();
    
    const studentToken = (await cookieStore).get('studentToken');
    const professorToken = (await cookieStore).get('professorToken');
    
    const token = studentToken?.value || professorToken?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
      name: string;
      collegeId: string;
      studentId?: string;
      professorId?: string;
    };

    return {
      id: decoded.id,
      role: decoded.role,
      name: decoded.name,
      collegeId: decoded.collegeId,
      studentId: decoded.studentId,
      professorId: decoded.professorId,
    };

  } catch (error) {
    console.error('Server profile fetch error:', error);
    return null;
  }
}