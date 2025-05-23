// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSkills() {
  const skills = [
    // Programming & Development
    { name: "Python" },
    { name: "JavaScript" },
    { name: "Java" },
    { name: "C/C++" },
    { name: "Go" },
    { name: "Rust" },
    { name: "Ruby" },
    { name: "PHP" },
    { name: "SQL" },
    { name: "NoSQL" },
    { name: "HTML/CSS" },
    { name: "React" },
    { name: "Angular" },
    { name: "Vue.js" },
    { name: "Node.js" },
    { name: "Django" },
    { name: "Flask" },
    { name: "Spring Boot" },
    { name: "Express.js" },
    { name: "Mobile App Development" },
    
    // Data Science & AI
    { name: "Machine Learning" },
    { name: "Deep Learning" },
    { name: "Natural Language Processing" },
    { name: "Computer Vision" },
    { name: "Reinforcement Learning" },
    { name: "Data Analysis" },
    { name: "Data Visualization" },
    { name: "Big Data" },
    { name: "Statistical Analysis" },
    { name: "R Programming" },
    { name: "TensorFlow" },
    { name: "PyTorch" },
    { name: "Scikit-learn" },
    { name: "Pandas" },
    { name: "NumPy" },
    { name: "MATLAB" },
    { name: "Time Series Analysis" },
    { name: "Bayesian Statistics" },
    
    // Research & Academic
    { name: "Literature Review" },
    { name: "Research Methodology" },
    { name: "Academic Writing" },
    { name: "Technical Writing" },
    { name: "Statistical Methods" },
    { name: "Experimental Design" },
    { name: "Survey Design" },
    { name: "Qualitative Analysis" },
    { name: "Quantitative Analysis" },
    { name: "Meta-Analysis" },
    { name: "Systematic Review" },
    
    // Engineering
    { name: "Circuit Design" },
    { name: "Microcontroller Programming" },
    { name: "PCB Design" },
    { name: "Embedded Systems" },
    { name: "Signal Processing" },
    { name: "Control Systems" },
    { name: "Robotics" },
    { name: "IoT Development" },
    { name: "CAD/CAM" },
    { name: "3D Modeling" },
    { name: "Finite Element Analysis" },
    { name: "Computational Fluid Dynamics" },
    
    // Domain-Specific
    { name: "Bioinformatics" },
    { name: "Quantum Computing" },
    { name: "Cryptography" },
    { name: "Blockchain" },
    { name: "Cybersecurity" },
    { name: "Network Security" },
    { name: "Cloud Computing" },
    { name: "DevOps" },
    { name: "Renewable Energy" },
    { name: "Sustainability Analysis" },
    { name: "GIS" },
    { name: "Image Processing" },
    
    // Soft Skills
    { name: "Project Management" },
    { name: "Technical Documentation" },
    { name: "Public Speaking" },
    { name: "Team Leadership" },
    { name: "Scientific Communication" },
    { name: "Grant Writing" },
    { name: "Problem-Solving" },
    { name: "Critical Thinking" }
  ];

  console.log('Seeding skills...');
  
  // Create all skills in a single transaction
  await prisma.skill.createMany({
    data: skills,
    skipDuplicates: true, // Skip if the skill already exists
  });
  
  console.log(`Seeded ${skills.length} skills successfully!`);
}

async function main() {
  try {
    await seedSkills();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();