export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  iconName: "scissors" | "smile" | "palette" | "wand" | "crown" | "leaf" | "star" | "shield";
}

export const servicesData: ServiceItem[] = [
  {
    id: "service-1",
    title: "Precision Haircuts",
    description: "Advanced architectural cutting techniques tailored to your face shape and hair texture.",
    price: "$85",
    iconName: "scissors",
  },
  {
    id: "service-2",
    title: "Beard Styling",
    description: "Sculpting and grooming using traditional razor techniques and premium essential oils.",
    price: "$45",
    iconName: "smile",
  },
  {
    id: "service-3",
    title: "Hair Coloring",
    description: "Multi-dimensional color work from subtle grey blending to high-fashion transformation.",
    price: "$120",
    iconName: "palette",
  },
  {
    id: "service-4",
    title: "Hair Styling",
    description: "Professional blowouts and heat styling for that perfect, effortless red-carpet finish.",
    price: "$60",
    iconName: "wand",
  },
  {
    id: "service-5",
    title: "Women's Dressing",
    description: "Elegant editorial hair dressing and draping for special occasions and photography.",
    price: "$150",
    iconName: "crown",
  },
  {
    id: "service-6",
    title: "Hair Treatment",
    description: "Deep restorative rituals using organic elixirs to rebuild hair health from within.",
    price: "$95",
    iconName: "leaf",
  },
  {
    id: "service-7",
    title: "Bridal Styling",
    description: "Luxury bridal concierge service including consultation, trial, and day-of styling.",
    price: "Inquiry Only",
    iconName: "star",
  },
  {
    id: "service-8",
    title: "Grooming Consultation",
    description: "One-on-one session to audit your look and develop a personalized maintenance regime.",
    price: "$110",
    iconName: "shield",
  },
];
