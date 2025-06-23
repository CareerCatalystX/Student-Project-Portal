// prisma/seed.js
import prisma from '../lib/prisma';

// Sample data arrays
const projectTitles = [
  "AI-Powered Student Performance Analytics",
  "Smart Campus IoT System",
  "Blockchain-based Certificate Verification",
  "Machine Learning for Crop Disease Detection",
  "Virtual Reality Educational Platform",
  "Automated Code Review System",
  "Sustainable Energy Management System",
  "Social Media Sentiment Analysis Tool",
  "Robotic Process Automation Framework",
  "Cybersecurity Threat Detection System",
  "Mobile Health Monitoring Application",
  "E-commerce Recommendation Engine",
  "Smart Traffic Management System",
  "Natural Language Processing Chatbot",
  "Augmented Reality Museum Guide",
  "Predictive Maintenance for Manufacturing",
  "Digital Twin for Smart Buildings",
  "Automated Essay Grading System",
  "Drone-based Agricultural Monitoring",
  "Quantum Computing Simulator",
  "Biometric Authentication System",
  "Smart Waste Management Solution",
  "Financial Fraud Detection Platform",
  "Voice-controlled Home Automation",
  "Medical Image Analysis Tool",
  "Supply Chain Optimization System",
  "Real-time Collaborative Coding Platform",
  "Climate Change Prediction Model",
  "Autonomous Vehicle Navigation System",
  "Smart Grid Energy Distribution"
];

const descriptions = [
  "Develop an advanced analytics platform using machine learning algorithms to predict student performance and identify at-risk students early.",
  "Create a comprehensive IoT ecosystem for smart campus management including energy optimization, security monitoring, and resource tracking.",
  "Build a secure blockchain-based system for issuing and verifying academic certificates to prevent fraud and ensure authenticity.",
  "Design a mobile application using computer vision and machine learning to help farmers identify crop diseases and suggest treatments.",
  "Develop an immersive VR platform for educational content delivery with interactive 3D environments and simulations.",
  "Create an AI-powered system that automatically reviews code submissions, detects bugs, and suggests improvements.",
  "Build a comprehensive energy management system that optimizes power consumption and integrates renewable energy sources.",
  "Develop a real-time sentiment analysis tool that processes social media data to gauge public opinion on various topics.",
  "Design an RPA framework to automate repetitive business processes and improve operational efficiency.",
  "Create an advanced cybersecurity system that uses machine learning to detect and prevent cyber threats in real-time.",
  "Build a mobile health application that monitors vital signs, tracks health metrics, and provides personalized health insights.",
  "Develop a sophisticated recommendation engine for e-commerce platforms using collaborative filtering and deep learning.",
  "Create an intelligent traffic management system that optimizes traffic flow and reduces congestion using AI algorithms.",
  "Build a conversational AI chatbot capable of understanding and responding to natural language queries across multiple domains.",
  "Develop an AR application that provides interactive guided tours and historical information for museums and cultural sites.",
  "Create a predictive maintenance system for manufacturing equipment using sensor data and machine learning algorithms.",
  "Build a digital twin platform for smart buildings that simulates and optimizes building operations and energy usage.",
  "Develop an automated essay grading system using natural language processing and machine learning techniques.",
  "Create a drone-based monitoring system for agricultural fields that provides real-time crop health and yield predictions.",
  "Build a quantum computing simulator to model quantum algorithms and help researchers understand quantum phenomena.",
  "Develop a multi-modal biometric authentication system combining fingerprint, facial recognition, and voice verification.",
  "Create a smart waste management solution that optimizes collection routes and monitors waste levels in real-time.",
  "Build a comprehensive fraud detection platform for financial institutions using advanced analytics and machine learning.",
  "Develop a voice-controlled home automation system that integrates with IoT devices and provides intelligent home management.",
  "Create a medical image analysis tool that assists doctors in diagnosing diseases from X-rays, CT scans, and MRIs.",
  "Build a supply chain optimization system that improves efficiency, reduces costs, and enhances transparency.",
  "Develop a real-time collaborative coding platform that enables multiple developers to work together seamlessly.",
  "Create a climate change prediction model using satellite data, weather patterns, and machine learning algorithms.",
  "Build an autonomous vehicle navigation system that uses computer vision and sensor fusion for safe self-driving.",
  "Develop a smart grid system that optimizes energy distribution and integrates renewable energy sources efficiently."
];

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics & Communication",
  "Information Technology",
  "Biotechnology",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Data Science"
];

const professorNames = [
  "Dr. Rajesh Kumar",
  "Dr. Priya Sharma",
  "Dr. Amit Patel",
  "Dr. Neha Gupta",
  "Dr. Suresh Reddy",
  "Dr. Kavita Singh",
  "Dr. Manoj Verma",
  "Dr. Sunita Joshi",
  "Dr. Ravi Agarwal",
  "Dr. Meera Nair"
];

const durations = ["1 month", "2 months", "3 months", "4 months", "6 months"];

const preferredDepartments = [
  ["Computer Science", "Information Technology"],
  ["Electrical Engineering", "Electronics & Communication"],
  ["Mechanical Engineering", "Civil Engineering"],
  ["Computer Science", "Data Science"],
  ["Biotechnology", "Chemical Engineering"],
  ["Aerospace Engineering", "Mechanical Engineering"],
  ["Information Technology", "Computer Science", "Data Science"],
  ["Electronics & Communication", "Electrical Engineering"],
  ["Civil Engineering", "Mechanical Engineering"],
  ["Computer Science", "Electronics & Communication"]
];

// Function to get random element from array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to get random number between min and max
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get random date between now and 6 months from now
function getRandomFutureDate(): Date {
  const now = new Date();
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(now.getMonth() + 6);
  
  const randomTime = now.getTime() + Math.random() * (sixMonthsFromNow.getTime() - now.getTime());
  return new Date(randomTime);
}

async function seedProjects() {
  try {
    console.log('Starting to seed projects...');

    // First, get existing colleges, professors, and categories
    const colleges = await prisma.college.findMany();
    const professors = await prisma.professor.findMany();
    const categories = await prisma.projectCategory.findMany();
    const skills = await prisma.skill.findMany();

    console.log(`Found ${colleges.length} colleges, ${professors.length} professors`);

    if (colleges.length === 0) {
      console.log('No colleges found. Please seed colleges first.');
      return;
    }

    if (professors.length === 0) {
      console.log('No professors found. Please seed professors first.');
      return;
    }

    // Create some default categories if they don't exist
    const defaultCategories = [
      'Web Development',
      'Mobile Development',
      'Machine Learning',
      'Data Science',
      'IoT',
      'Blockchain',
      'Cybersecurity',
      'AI/ML',
      'Hardware',
      'Software Engineering'
    ];

    for (const categoryName of defaultCategories) {
      await prisma.projectCategory.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName }
      });
    }

    // Create some default skills if they don't exist
    const defaultSkills = [
      'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
      'Machine Learning', 'Data Analysis', 'SQL', 'MongoDB',
      'Docker', 'Kubernetes', 'AWS', 'Git', 'HTML/CSS',
      'TensorFlow', 'PyTorch', 'OpenCV', 'Blockchain', 'IoT'
    ];

    for (const skillName of defaultSkills) {
      await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName }
      });
    }

    // Fetch updated categories and skills
    const updatedCategories = await prisma.projectCategory.findMany();
    const updatedSkills = await prisma.skill.findMany();

    // Create 30 dummy projects
    const projects = [];
    for (let i = 0; i < 30; i++) {
      const randomCollege = getRandomElement(colleges) as { id: string; name: string };
      const randomProfessor = getRandomElement(professors) as { id: string; userId: string };
      const randomCategory = getRandomElement(updatedCategories) as { id: string; name: string };
      
      const project = {
        title: projectTitles[i],
        description: descriptions[i],
        duration: getRandomElement(durations),
        stipend: Math.random() > 0.3 ? getRandomNumber(5000, 50000) : null,
        deadline: getRandomFutureDate(),
        professorId: randomProfessor.id,
        professorName: getRandomElement(professorNames),
        department: getRandomElement(departments),
        collegeId: randomCollege.id,
        categoryId: randomCategory.id,
        numberOfStudentsNeeded: getRandomNumber(1, 5),
        preferredStudentDepartments: getRandomElement(preferredDepartments),
        certification: Math.random() > 0.5,
        letterOfRecommendation: Math.random() > 0.4,
      };

      const createdProject = await prisma.project.create({
        data: project
      });

      // Add 2-4 random skills to each project
      const numberOfSkills = getRandomNumber(2, 4);
      const selectedSkills: string[] = [];
      for (let j = 0; j < numberOfSkills; j++) {
        const skill = getRandomElement(updatedSkills) as { id: string; name: string };
        if (!selectedSkills.includes(skill.id)) {
          selectedSkills.push(skill.id);
          await prisma.projectSkill.create({
            data: {
              projectId: createdProject.id,
              skillId: skill.id
            }
          });
        }
      }

      projects.push(createdProject);
      console.log(`Created project ${i + 1}: ${project.title}`);
    }

    console.log(`Successfully seeded ${projects.length} projects!`);
    
  } catch (error) {
    console.error('Error seeding projects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
seedProjects();