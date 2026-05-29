export interface AcademyCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  syllabus: string[];
}

export const academyCourses: AcademyCourse[] = [
  {
    id: "course-1",
    title: "Foundation Hair Styling & Barbering",
    description: "A comprehensive course designed for aspiring stylists. Master the core principles of scissors cutting, architectural texturing, and essential salon operations.",
    duration: "3 Months (Full-Time)",
    price: "$1,200",
    level: "Beginner",
    syllabus: [
      "Introduction to hair science and scalp health",
      "Core scissors cutting angles and texturing methods",
      "Traditional and modern barbering techniques",
      "Basic blow-drying and styling operations",
    ],
  },
  {
    id: "course-2",
    title: "Advanced Dimensional Hair Coloring",
    description: "Elevate your coloring skills. Learn advanced tinting, multi-dimensional highlighting, balayage, and grey coverage techniques directly from Rahul S Tipukade.",
    duration: "2 Weeks (Intensive)",
    price: "$450",
    level: "Advanced",
    syllabus: [
      "Advanced color theory and product matching",
      "Balayage and custom highlight placement",
      "Grey coverage and tone restoration",
      "Corrective coloring masterclass case studies",
    ],
  },
  {
    id: "course-3",
    title: "Soft Skills, Communication & Salon Operations",
    description: "The secret to a 20-year career. Master elite client communication, consultations, client retention strategies, and salon business operations.",
    duration: "1 Week (Weekend Workshop)",
    price: "$250",
    level: "Intermediate",
    syllabus: [
      "Psychology of the client consultation",
      "Effective communication and vision alignment",
      "Client retention strategies and relationship building",
      "Introduction to salon workflow and POS operations",
    ],
  },
];
