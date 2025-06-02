export interface ProfessorProject {
  id: string;
  title: string;
  description: string;
  closed: boolean;
  deadline: string;
}

export interface ProfessorUser {
  name: string;
  email: string;
  role: string;
  college: {
    name: string;
  };
}

export interface ProfessorProfileType {
  isUpdated: boolean;
  department: string;
  designation: string;
  qualification: string;
  researchAreas: string;
  officeLocation: string;
  officeHours: string;
  bio: string;
  publications: string;
  websiteUrl: string;
  projects: ProfessorProject[];
  user: ProfessorUser;
}
