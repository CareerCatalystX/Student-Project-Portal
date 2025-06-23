"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// prisma/seed.js
var prisma_1 = require("../lib/prisma");
// Sample data arrays
var projectTitles = [
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
var descriptions = [
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
var departments = [
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
var professorNames = [
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
var durations = ["1 month", "2 months", "3 months", "4 months", "6 months"];
var preferredDepartments = [
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
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
// Function to get random number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Function to get random date between now and 6 months from now
function getRandomFutureDate() {
    var now = new Date();
    var sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(now.getMonth() + 6);
    var randomTime = now.getTime() + Math.random() * (sixMonthsFromNow.getTime() - now.getTime());
    return new Date(randomTime);
}
function seedProjects() {
    return __awaiter(this, void 0, void 0, function () {
        var colleges, professors, categories, skills, defaultCategories, _i, defaultCategories_1, categoryName, defaultSkills, _a, defaultSkills_1, skillName, updatedCategories, updatedSkills, projects, i, randomCollege, randomProfessor, randomCategory, project, createdProject, numberOfSkills, selectedSkills, j, skill, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 23, 24, 26]);
                    console.log('Starting to seed projects...');
                    return [4 /*yield*/, prisma_1.default.college.findMany()];
                case 1:
                    colleges = _b.sent();
                    return [4 /*yield*/, prisma_1.default.professor.findMany()];
                case 2:
                    professors = _b.sent();
                    return [4 /*yield*/, prisma_1.default.projectCategory.findMany()];
                case 3:
                    categories = _b.sent();
                    return [4 /*yield*/, prisma_1.default.skill.findMany()];
                case 4:
                    skills = _b.sent();
                    console.log("Found ".concat(colleges.length, " colleges, ").concat(professors.length, " professors"));
                    if (colleges.length === 0) {
                        console.log('No colleges found. Please seed colleges first.');
                        return [2 /*return*/];
                    }
                    if (professors.length === 0) {
                        console.log('No professors found. Please seed professors first.');
                        return [2 /*return*/];
                    }
                    defaultCategories = [
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
                    _i = 0, defaultCategories_1 = defaultCategories;
                    _b.label = 5;
                case 5:
                    if (!(_i < defaultCategories_1.length)) return [3 /*break*/, 8];
                    categoryName = defaultCategories_1[_i];
                    return [4 /*yield*/, prisma_1.default.projectCategory.upsert({
                            where: { name: categoryName },
                            update: {},
                            create: { name: categoryName }
                        })];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    defaultSkills = [
                        'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
                        'Machine Learning', 'Data Analysis', 'SQL', 'MongoDB',
                        'Docker', 'Kubernetes', 'AWS', 'Git', 'HTML/CSS',
                        'TensorFlow', 'PyTorch', 'OpenCV', 'Blockchain', 'IoT'
                    ];
                    _a = 0, defaultSkills_1 = defaultSkills;
                    _b.label = 9;
                case 9:
                    if (!(_a < defaultSkills_1.length)) return [3 /*break*/, 12];
                    skillName = defaultSkills_1[_a];
                    return [4 /*yield*/, prisma_1.default.skill.upsert({
                            where: { name: skillName },
                            update: {},
                            create: { name: skillName }
                        })];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    _a++;
                    return [3 /*break*/, 9];
                case 12: return [4 /*yield*/, prisma_1.default.projectCategory.findMany()];
                case 13:
                    updatedCategories = _b.sent();
                    return [4 /*yield*/, prisma_1.default.skill.findMany()];
                case 14:
                    updatedSkills = _b.sent();
                    projects = [];
                    i = 0;
                    _b.label = 15;
                case 15:
                    if (!(i < 30)) return [3 /*break*/, 22];
                    randomCollege = getRandomElement(colleges);
                    randomProfessor = getRandomElement(professors);
                    randomCategory = getRandomElement(updatedCategories);
                    project = {
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
                    return [4 /*yield*/, prisma_1.default.project.create({
                            data: project
                        })];
                case 16:
                    createdProject = _b.sent();
                    numberOfSkills = getRandomNumber(2, 4);
                    selectedSkills = [];
                    j = 0;
                    _b.label = 17;
                case 17:
                    if (!(j < numberOfSkills)) return [3 /*break*/, 20];
                    skill = getRandomElement(updatedSkills);
                    if (!!selectedSkills.includes(skill.id)) return [3 /*break*/, 19];
                    selectedSkills.push(skill.id);
                    return [4 /*yield*/, prisma_1.default.projectSkill.create({
                            data: {
                                projectId: createdProject.id,
                                skillId: skill.id
                            }
                        })];
                case 18:
                    _b.sent();
                    _b.label = 19;
                case 19:
                    j++;
                    return [3 /*break*/, 17];
                case 20:
                    projects.push(createdProject);
                    console.log("Created project ".concat(i + 1, ": ").concat(project.title));
                    _b.label = 21;
                case 21:
                    i++;
                    return [3 /*break*/, 15];
                case 22:
                    console.log("Successfully seeded ".concat(projects.length, " projects!"));
                    return [3 /*break*/, 26];
                case 23:
                    error_1 = _b.sent();
                    console.error('Error seeding projects:', error_1);
                    return [3 /*break*/, 26];
                case 24: return [4 /*yield*/, prisma_1.default.$disconnect()];
                case 25:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 26: return [2 /*return*/];
            }
        });
    });
}
// Run the seeder
seedProjects();
