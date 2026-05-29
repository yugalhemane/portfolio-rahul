const mongoose = require("mongoose");
const Service = require("../models/Service");
const Course = require("../models/Course");
const Gallery = require("../models/Gallery");
const Testimonial = require("../models/Testimonial");

const servicesData = [
  {
    title: "Precision Haircuts",
    description: "Advanced architectural cutting techniques tailored to your face shape and hair texture.",
    price: "$85",
    category: "Haircuts",
    icon: "scissors",
  },
  {
    title: "Beard Styling",
    description: "Sculpting and grooming using traditional razor techniques and premium essential oils.",
    price: "$45",
    category: "Grooming",
    icon: "smile",
  },
  {
    title: "Hair Coloring",
    description: "Multi-dimensional color work from subtle grey blending to high-fashion transformation.",
    price: "$120",
    category: "Coloring",
    icon: "palette",
  },
  {
    title: "Hair Styling",
    description: "Professional blowouts and heat styling for that perfect, effortless red-carpet finish.",
    price: "$60",
    category: "Styling",
    icon: "wand",
  },
  {
    title: "Women's Dressing",
    description: "Elegant editorial hair dressing and draping for special occasions and photography.",
    price: "$150",
    category: "Dressing",
    icon: "crown",
  },
  {
    title: "Hair Treatment",
    description: "Deep restorative rituals using organic elixirs to rebuild hair health from within.",
    price: "$95",
    category: "Treatment",
    icon: "leaf",
  },
  {
    title: "Bridal Styling",
    description: "Luxury bridal concierge service including consultation, trial, and day-of styling.",
    price: "Inquiry Only",
    category: "Bridal",
    icon: "star",
  },
  {
    title: "Grooming Consultation",
    description: "One-on-one session to audit your look and develop a personalized maintenance regime.",
    price: "$110",
    category: "Consultation",
    icon: "shield",
  },
];

const academyCourses = [
  {
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

const galleryItems = [
  {
    title: "Signature Precision Cut",
    category: "cuts",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI4-dSghaD4p7AlO-K30DRyb4c4bBV_KEUxHyVJ69S_GXScnm48j-vdSf85wFDMvgHNrBgcTGBos9bg0uZP2JSOk11E28ZTRCuRwzRFjSQISf6jjd6zB4UVE4XaNGK33oz9_i-8MAsQigI2leXE3nt2WwYvBWAG8oDIk4cpoxNOBZkae-cutif1tV8Ju6OfcBs8hRbry2M-NOe4J5iDWGNIsf230NzGg-50fcoUEEQ7_DvJ93UuJwtJqqQKGPvpi7fqxttJp3qFuo",
    description: "Signature architectural styling",
  },
  {
    title: "Signature Pompadour Transformation",
    category: "transformations",
    beforeImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwG9AioRBKZkcYzmOzRmW7aDgi6Ur3vOvj5X6A5BXi0qMXceWV5j9IXwaT_XuV2EAtGE7T140KxXMJN46isQx_pPUzloT4bu626U6AuiKd2E-9qkB39V4FnuUBL8BN8Z40tuEHfnKSXcstwqF2uVjnF4ENaBckfoFPatOtDboaLDPZ5qvYOXZU7KU--HbjzjwG-l1osvyS7uryajaw_KUaoRGVMc19YuyJ25wV_V7YHOBYwYKe8sTsyCO5ebtSeey6iAaxVaC5nPA",
    afterImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBowznbSvls8WwbaA_i73BuePK3S8nJqtLMH1BCKWLfCC3X3ewbxxEgFMjZMM2qzem47Tgb1-5ovVkL3igbMJmjRal8oVDvKNKM4upY_2AMGWqeijtZlPJf8KTibCwKLPHNYwyMPYHntZig49fu3kjxQLpBEWJwDjmhDQ3L7GoNorsMu_PC31HS8R5F9nHrMC-79M4qW-S9YgmRxczSWb6OqN8FtsBf0qGjeVDUYqcMNltXePoCO29BxzZkpGlOw5s3rcbrWHIAAbk",
    description: "Full volume redesign, hair texturing, and sharp temple fade.",
  },
  {
    title: "The Sculpting Process",
    category: "reels",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-barber-cutting-hair-with-shears-43093-large.mp4",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRz1wrYjkxMsx21n7qax0ZZz-NjdkSvI_-27fCnFqSG0n95jhspvctBrMlok0V7y2fpULilLt9da7hVFxAq_wWXE1Y49ztvV7sPAimNqCIieks3SuwfRKH3a7seTcxzWyc9ogvSH1GKRPE96xfm9-L-8QRYckavfRCwAi3k4Ozl4bv-6RyIMopIBtPPwuGF9RWfWWLjTyTlrseylfPF8Et9HrP8YYtGkhD-spSOUKBqGwtXUmN6fxkvS2FUOHLMbzQKm82Us2yfYQ",
    description: "Behind the scenes scissor work",
  },
  {
    title: "Textured Volume",
    category: "styling",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqIpO-ijNnKdpYEIMjP1Rmuu_L-TP3313Fl-9aKqiouBK77HCJA-yrmHnRWNU1e88W6rSLevzrE14VnZDWZkofsuQaJPw2CgF8N_9jgxl1cAw7mCO4V8aFRwMenWxHuyTydJ8eyfqaOyr5O-1KQeZoSoIbK1lkP4ggQ-t-T4qbbUK4Bii6Ug4UXLxyE5XGxfYsgcDYE_3AdgFCB6R9vjKnYtKdyYHKxRX_oLiG6DZ8Yp-5bl7Mp9oFPS92zBmpqTQddPyZrTOcCnw",
    description: "Editorial standard texturing and shape definition.",
  },
  {
    title: "Royal Bridal Braids",
    category: "bridal",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyUUic5Tu2j1-pZee28--EOFbRM0hP0rAenCoG1RcUU8fF4R8rdz0LCjGv0mLrUczebDdmNQydPkq_TZ3tEIJwvAEjEjIPQRjclE7zQZGEBvdlMn5uyVAtNOJTyIHTtg2CNNyyJjqMA_uLy-UGhxZ0JPK3lRf_gscGHz2L18hBzCParXpXPfD_8_ZBAx_seT-H0WCfkrx0WlTjCC_RyRjKjHzh6TxTMtPTo5CD6auYxaEOvl4z3akz-6O1pb6o9ifae3J1BtCgbaM",
    description: "Luxury bridal hair design",
  },
  {
    title: "Classic Refinement Cut",
    category: "cuts",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB-CU6oyQNHYj5mjJo3xDXFCAwMTx8U1zFwBfMiCRHTkDKN0xj0_7iJNR_4IQxWWk-4ft3soZNcpUi9guA9Xkwc_L929MKjBylrh5eBul6jelzXkb3BUag9noNP2dZXnTyKHjeuxi4YHZNSu3UFuJp78-YQzSCBxDWwz3PPwmbuM5kBnkXaVVI82xwCDtBZwFeWJkgvpNXpwGJ-xcvrD1nfRUjOsb2woUCIChxwhNdOmbWhnE7bD3Ufl65GEc9CuAyot4ASKPIbgM",
    description: "Traditional scissor work with modern contours",
  },
  {
    title: "Razor Precision Grooming",
    category: "grooming",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjdx8sYgFBU6jMVoNKIL7EuOhtGMQ2y5zxeFKhoYE4tm_EAVN_C49zRUce8mv5ltAPrkrZXhSiKTUu2aSQstIi0uoWsHFLQO6DpuyeiOkcVRmmhNOaUaMT1jY_omCXic6KUAf0p_7BKaFY61KK483mqBxWI9bsuFLWue9JrY3uUxbUKOul6-vHo-7M5po7PpdGh_KOpv63gzvCnJTgk_RTx1LglpvcdZtNmMsu0Bfxz1u5vOlv1snGvXPNpj_48qE7z51G8SVW1E4",
    description: "Straight razor heritage detailing",
  },
  {
    title: "Geometric Color Art",
    category: "colors",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDog8l6xWWLTJiVpXeAkcf1Al6P9vxYWfQpnSzWuEnnmvbGui7JyqeAwKcFsjY0S3b9ofJ3hBvmdfc8i-yhWBgBBqmkJ-_gsHRRGuhq_TRyjeqme7LrrWwZc8DNY3QoU9wXn5ZB0t3zz5Y0sGHNPEJb37B5Hv_zUrAFX5qbqwj9vStbBsYZwDSaC_tsP3NKCkITibtVEZyNYn7bJ_gKkvXnWiK3H17cnhx-HcJZcMmCk3BWuKBkgnl97oIR5Kp9CK11FEKZ_sRq1jE",
    description: "High-end multi-dimensional coloring work",
  },
  {
    title: "Elite Beard Sculpting",
    category: "grooming",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD23LboQhhW-UO7kHP7bkGjhXajMkMb4CO4ov13qumAUt_H7CUnwDs7ZuC8ixTx4BIy4gaJnOZj-p_dZJtbqvPFvuPC51bhWF0cup9ghYlBe97C-vZOoFGvY5DkkmFb1lGIL85K0Rmlr3KztLEEJMVTSc0grpMjTBC57A1-zXmXPr1zWYVPJBMyni373mTMVz2G1fnWen1zDgHj0qepr55Y0LmgqR6_a2Ra8enkMs1rKDnaGEpwWtgfCSNTs4qC1UVN7jInIEOJ86w",
    description: "Crisp line definition and beard sculpting",
  },
  {
    title: "Modern Matte Texture",
    category: "styling",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuClARbpHFnwO2nUaN5Kjeq7zOY_Nfw6iYmgRYVYmRtf7_VWyyzChSGAsKYpFZ1FMkCrfFvmEu7qZZQmu3uQKf7KZ52ToEDRftXn86XTqbiplK9a3quFHUTevXu36Q3W42QoID2attXYOUWqncJY1ISF2eunwOhsRW8CNvP_NNw18cWF63VtRgxUMN58W7f9vImuo54PYDjf5uYXvi62cS7D1NrPCI5ZUm_qRsqbstTPiktYmsTKp9fkGinK1BapTN6Mwki1bAI-qpc",
    description: "Effortless matte styling finish",
  },
  {
    title: "The Atelier Sanctuary",
    category: "studio",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJJlSzSUW6JeSjo6L5GyUd5G85h8GQDPOd4iC7LKNHA7sbLh9cIisAevq_OF7OvZxcoZDvwhDp6-LC8j67m-fj2wSeUX-sNNpKhvaQf5fzk89q8BO04ebJIkI-xCTiHavtv2d-szvSwGTXAR3l3R3kDZxhlNprgZI667bRsXFDaiFdWROlRa9WvVeyJlCSxxbTI5w9gKHiyYGd-9MYTtUkS4bVwYRmZEGjdyDJqSIcva8hbrr2W1T5aiARCH9V_pRlOibhhDVZQvM",
    description: "Our luxury styling salon space",
  },
];

const testimonialsData = [
  {
    clientName: "Ananya Sharma",
    feedback: "Rahul's expertise is evident from the first cut. His 20 years of experience translates into a level of confidence and precision I haven't found elsewhere.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAg_kk6GgOQSh_0FXlY-9XPv3b1F_qlZpZl5edPxUZxWfsqUYmlDiaX-G-RgeFb8Mnmrd9YS_vnT2KXdaQpGigkiRuZA9n7klQOYTbqKN0zLtNMi_YpVcTYUUxFHywf5ry5MduIVp4haOmy098kxUF924M6lz9ZrfwVx8os4Wqo98RUp5JNvWBgDgyxzjT_VdJOBhOA1G5x17ASGnUQATlQicDA05YenThAfq6SzWHEz2HRcRlzelgG2hFRd_Jip9_LIKLWfWyCosc",
    rating: 5,
  },
  {
    clientName: "Vikram Malhotra",
    feedback: "Finding a stylist who understands both classic grooming and modern trends is rare. Rahul is a master of both. Highly recommended for any professional.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdYf9rjdcyjr-XtWr10TQpMd8lrXcTzFsWo9JyVQOpw6fc373QMoRvFcI3YaacdKZSQvNPAFVicq6o0JAzmGt00tKPWKNVXPBooj1hWPQYaQBLF1KOifuNt--uqzZNoLQ3EStC1Qx3HtNxUTE7YiUuthB0MUNES6RHtpxcNRtkQu9obCBT3_CcNJcw1aN-wVBfI_FnI9jYpDFb4CH94py8jCSAkzDdsqdWaUnS6tTc-t6srJzUNMirP0B6-hvDs9_-fPtcRgV1GT0",
    rating: 5,
  },
  {
    clientName: "Priya Verma",
    feedback: "The transformation was incredible. Rahul doesn't just cut hair; he designs a look that fits your personality and lifestyle perfectly.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXu-yqf3gVEHDxbzLZNCdJUEHmfVQqm0gtYx0nc1WLbyhtQ_R0n6U3gzh9rASJpTAvhORp7e17kIfJMp1Z-VVNqU077imsOx_iCSqwiU1nChklIytTt7Yd-aLu6sMs3uM7i9YDJnFrrdoug8zLU5aSKrNw3QLY98fvJFLC6pEb-pTxLZd3Hgcsy8RbqyHEBESnC40A1wci8cqESK7hjFP-VRgbYQ36PjlOqJz0tVwek2su4PqodXFxk_iTu4uO_N9xaK2Orxu3qpJ6k",
    rating: 5,
  }
];

const seedDatabase = async () => {
  try {
    // 1. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log("Seeding default services...");
      await Service.insertMany(servicesData);
      console.log(`Successfully seeded ${servicesData.length} default services.`);
    }

    // 2. Seed Academy Courses
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log("Seeding default academy courses...");
      await Course.insertMany(academyCourses);
      console.log(`Successfully seeded ${academyCourses.length} default courses.`);
    }

    // 3. Seed Gallery Items
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      console.log("Seeding default gallery items...");
      await Gallery.insertMany(galleryItems);
      console.log(`Successfully seeded ${galleryItems.length} default gallery items.`);
    }

    // 4. Seed Testimonials
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      console.log("Seeding default testimonials...");
      await Testimonial.insertMany(testimonialsData);
      console.log(`Successfully seeded ${testimonialsData.length} default testimonials.`);
    }

  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

module.exports = seedDatabase;
