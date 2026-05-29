"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Users, Award, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import LuxuryNavbar from "@/components/common/LuxuryNavbar";
import PremiumFooter from "@/components/common/PremiumFooter";
import GlassCard from "@/components/common/GlassCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SPACER_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const staticTestimonials = [
  {
    _id: "static-1",
    clientName: "Ananya Sharma",
    feedback: "Rahul's expertise is evident from the first cut. His 20 years of experience translates into a level of confidence and precision I haven't found elsewhere.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAg_kk6GgOQSh_0FXlY-9XPv3b1F_qlZpZl5edPxUZxWfsqUYmlDiaX-G-RgeFb8Mnmrd9YS_vnT2KXdaQpGigkiRuZA9n7klQOYTbqKN0zLtNMi_YpVcTYUUxFHywf5ry5MduIVp4haOmy098kxUF924M6lz9ZrfwVx8os4Wqo98RUp5JNvWBgDgyxzjT_VdJOBhOA1G5x17ASGnUQATlQicDA05YenThAfq6SzWHEz2HRcRlzelgG2hFRd_Jip9_LIKLWfWyCosc",
    rating: 5,
    role: "CORPORATE EXECUTIVE"
  },
  {
    _id: "static-2",
    clientName: "Vikram Malhotra",
    feedback: "Finding a stylist who understands both classic grooming and modern trends is rare. Rahul is a master of both. Highly recommended for any professional.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdYf9rjdcyjr-XtWr10TQpMd8lrXcTzFsWo9JyVQOpw6fc373QMoRvFcI3YaacdKZSQvNPAFVicq6o0JAzmGt00tKPWKNVXPBooj1hWPQYaQBLF1KOifuNt--uqzZNoLQ3EStC1Qx3HtNxUTE7YiUuthB0MUNES6RHtpxcNRtkQu9obCBT3_CcNJcw1aN-wVBfI_FnI9jYpDFb4CH94py8jCSAkzDdsqdWaUnS6tTc-t6srJzUNMirP0B6-hvDs9_-fPtcRgV1GT0",
    rating: 5,
    role: "ENTREPRENEUR"
  },
  {
    _id: "static-3",
    clientName: "Priya Verma",
    feedback: "The transformation was incredible. Rahul doesn't just cut hair; he designs a look that fits your personality and lifestyle perfectly.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXu-yqf3gVEHDxbzLZNCdJUEHmfVQqm0gtYx0nc1WLbyhtQ_R0n6U3gzh9rASJpTAvhORp7e17kIfJMp1Z-VVNqU077imsOx_iCSqwiU1nChklIytTt7Yd-aLu6sMs3uM7i9YDJnFrrdoug8zLU5aSKrNw3QLY98fvJFLC6pEb-pTxLZd3Hgcsy8RbqyHEBESnC40A1wci8cqESK7hjFP-VRgbYQ36PjlOqJz0tVwek2su4PqodXFxk_iTu4uO_N9xaK2Orxu3qpJ6k",
    rating: 5,
    role: "CREATIVE DIRECTOR"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [testimonials, setTestimonials] = useState(staticTestimonials);
  const [sectionImages, setSectionImages] = useState<Record<string, string>>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/testimonials`);
        if (res.ok) {
          const data = await res.json();
          const staticList = [...staticTestimonials];
          const extraDbItems: typeof data = [];

          data.forEach((m: any, idx: number) => {
            if (idx < staticList.length) {
              staticList[idx] = m;
            } else {
              extraDbItems.push(m);
            }
          });

          const merged = [...staticList, ...extraDbItems];
          setTestimonials(merged);
        }
      } catch (err) {
        console.warn("Failed to fetch testimonials, using static fallbacks:", err);
      }
    };

    const fetchSectionImages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/section-images`);
        if (res.ok) {
          const data = await res.json();
          const mapping: Record<string, string> = {};
          data.forEach((item: any) => {
            const isLocalImg = item.imageUrl && !item.imageUrl.startsWith("http");
            const resolved = isLocalImg ? `${API_BASE_URL.replace("/api", "")}${item.imageUrl}` : item.imageUrl;
            mapping[item.key] = resolved.replace(/\.(heic|heif)$/i, ".jpg");
          });
          setSectionImages(mapping);
        }
      } catch (err) {
        console.warn("Failed to fetch section images, using fallbacks:", err);
      } finally {
        setImagesLoaded(true);
      }
    };

    fetchTestimonials();
    fetchSectionImages();
  }, []);

  return (
    <>
      <LuxuryNavbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center creamy-gradient overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-2 gap-stack-lg items-center py-stack-lg w-full">
            
            {/* Hero Left Content */}
            <motion.div 
              className="z-10 order-2 md:order-1"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.span 
                variants={fadeInUp}
                className="font-label-caps text-label-caps text-primary tracking-[0.2em] mb-4 block"
              >
                MASTER STYLIST &amp; MENTOR
              </motion.span>
              <motion.h1 
                variants={fadeInUp}
                className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6"
              >
                20+ Years of Professional Grooming &amp; Hair Styling
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-10 leading-relaxed"
              >
                Mastery in every cut, excellence in every style. Experience a legacy of precision and a modern approach to aesthetic grooming.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Link href="/booking">
                  <button className="bg-inverse-surface text-surface-bright px-10 py-4 rounded-full font-button-text text-button-text hover:shadow-xl transition-all active:scale-95">
                    Book Appointment
                  </button>
                </Link>
                <Link href="/services">
                  <button className="border border-outline-variant text-on-surface px-10 py-4 rounded-full font-button-text text-button-text hover:bg-surface-container-low transition-all active:scale-95">
                    Explore Services
                  </button>
                </Link>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="mt-8">
                <Link 
                  href="/academy" 
                  className="font-label-caps text-label-caps text-primary flex items-center gap-2 group w-max"
                >
                  JOIN TRAINING ACADEMY 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Right Image */}
            <motion.div 
              className="relative order-1 md:order-2 flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative z-10 w-full max-w-[450px] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl animate-float">
                <img 
                  alt="Rahul S Tipukade" 
                  className="w-full h-full object-cover" 
                  src={imagesLoaded ? (sectionImages.home_hero || "https://lh3.googleusercontent.com/aida-public/AB6AXuD6vhu1RljoqONcemxzHQ5DafcDCRnqt-kLsYub0wxabYh1DxCacSA9FTcAujFEVIxIN4D0d8JSjGdKZNWZfQU6aho-2mHvk6JBYam1n9zhKsaIEbhKh-Ryv4vmVrVGrmjdpQ_FUnZIn_V3LdenESaEsEnh3YrUop3KzfhQD4ECCSRY3rzJsc65ncvoe-nUcX8XLN11PwStm1yBTqnxG03OBPLh_jYN_pV49VULmYRgbic9EGSaOdPduDu93zwNOcpB1DpXFVxJn2E") : SPACER_GIF}
                />
              </div>
              {/* Decorative Blur Background Elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary-container/50 blur-3xl rounded-full"></div>
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-primary-container/40 blur-3xl rounded-full"></div>
            </motion.div>

          </div>
        </section>

        {/* Premium Statistics Section */}
        <section className="py-stack-md bg-surface-container-lowest border-y border-outline-variant/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter text-center">
              <GlassCard tiltEnabled={false} className="p-stack-sm rounded-xl">
                <div className="font-display-lg text-headline-md text-primary mb-2">20+</div>
                <div className="font-label-caps text-label-caps text-on-surface-variant">Years Experience</div>
              </GlassCard>
              <GlassCard tiltEnabled={false} className="p-stack-sm rounded-xl">
                <div className="font-display-lg text-headline-md text-primary mb-2">1000+</div>
                <div className="font-label-caps text-label-caps text-on-surface-variant">Happy Clients</div>
              </GlassCard>
              <GlassCard tiltEnabled={false} className="p-stack-sm rounded-xl">
                <div className="font-display-lg text-headline-md text-primary mb-2">500+</div>
                <div className="font-label-caps text-label-caps text-on-surface-variant">Transformations</div>
              </GlassCard>
              <GlassCard tiltEnabled={false} className="p-stack-sm rounded-xl">
                <div className="font-display-lg text-headline-md text-primary mb-2">100+</div>
                <div className="font-label-caps text-label-caps text-on-surface-variant">Students Trained</div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Why Choose Rahul Section */}
        <section className="py-stack-lg bg-surface">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row gap-stack-lg items-center">
              
              {/* Left text content */}
              <div className="w-full md:w-1/2">
                <h2 className="font-display-lg text-headline-md md:text-headline-lg text-on-surface mb-8">
                  Crafting Excellence Beyond Styling
                </h2>
                
                <div className="space-y-gutter">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-primary">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm mb-1 text-on-surface">Two Decades of Mastery</h3>
                      <p className="text-on-surface-variant font-body-md text-body-md">
                        A refined legacy of 20 years in the industry, evolving with trends while maintaining classic precision.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-primary">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm mb-1 text-on-surface">Expert in Diverse Styling</h3>
                      <p className="text-on-surface-variant font-body-md text-body-md">
                        Specialized expertise in both men's grooming and women's hair artistry, catering to all aesthetic needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-primary">
                      <Award size={20} />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm mb-1 text-on-surface">Elite Communication</h3>
                      <p className="text-on-surface-variant font-body-md text-body-md">
                        Multi-language proficiency ensuring every client's vision is understood and executed perfectly.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-primary">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm mb-1 text-on-surface">Modern Styling Knowledge</h3>
                      <p className="text-on-surface-variant font-body-md text-body-md">
                        Constantly updated on the latest global techniques, tools, and professional customer handling.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Images grid */}
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="rounded-xl overflow-hidden h-64 shadow-lg relative group">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      alt="Hairdressing tools" 
                      src={imagesLoaded ? (sectionImages.home_why_1 || "https://lh3.googleusercontent.com/aida-public/AB6AXuDD_rILHePl8FoF88G9zCyMu1FyjGqPaeT0y4uAMARiuWnZ7mKzsYkVkY2SKCMywnaAsEqM8qTAzvyB1JCzA4UOlCOyks6bAC7s1dP797VZikUQbOd4lGfiPtCt66NmhyNyMc3BFZ6TygQ9ivwK4nbgaa8kTzUYaaKaE7M9EkWznDuZpIRGKk1ufTKxoJ-bF2KkIzJu6wMe1dNNCNqzynyaHethG68Kn47OAjLnVHYArHvn5XBVzyFdy7D5yzT1LBqvEm7ItYGO2dg") : SPACER_GIF}
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden h-48 shadow-lg relative group">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      alt="Minimalist salon interior" 
                      src={imagesLoaded ? (sectionImages.home_why_2 || "https://lh3.googleusercontent.com/aida-public/AB6AXuDWD3IxtQ5RUEj-iE0CtYw73yKSEJvXcy-osovttPz_0Mlh06YL70c2jvdSn-FKnrWaZLK9IzakZwgblCfGvZGRyxccJR9NRL5YVEZIHIXfdHdtWp3pwQLc_gHqDzcOLz1PxgnTxk0UlmVS-v6QFGEEwo8ljtqYy8WmQebtkTZWANeHv-DHc2prVZdk6Scn3ECHKARnN8QO2Dm7EDs97UINP_yUUOr9Yw6G820ktw36gfQ0Dan0Za3_JbecT6RVvsrOT1-dl5WIlB0") : SPACER_GIF}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden h-48 shadow-lg relative group">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      alt="Stylist working" 
                      src={imagesLoaded ? (sectionImages.home_why_3 || "https://lh3.googleusercontent.com/aida-public/AB6AXuBdWVWEAYui1EGP_Bq5EUXdMBENU9HvGjHWGs8bQ13rpNom2dWvMdoxWyMxV3yRtTXLsz5xSSZBMF6iFL1g2N2Fc2eAkboxNXY-pWrGpoDRMY9_x9rwcMdJ01Vb7qUQAXZycVXOGn4Ox0TJsttszshezZVlBujShuuIPXsqXy-jrA-X4Vm1YPwsHUu3LLDnte91kdSvQ_-pQbv3f7QGhkZ3Qz776lTPniIfndhfQO6w_cVy04z4Yt_RvI_rVc7gCkntFYVWyAReHIY") : SPACER_GIF}
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden h-64 shadow-lg relative group">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      alt="Finished hairstyle model" 
                      src={imagesLoaded ? (sectionImages.home_why_4 || "https://lh3.googleusercontent.com/aida-public/AB6AXuCP1ysfvEOccryySAJkbYXMMqTl_zhOxrVKGjIU6gu6UoJp_Bb2a--Jbpzk290uEk0K3m406j-lSQTLZ2EBuxL39P2TH9K2ju1ta8yZIO0axo0Cb2t-FU8aM97kKxc1GMJhhfd547N6eP0WlXp_Hlj-LKWZuUvXbrgNcZMzO6ZE0Avj-RbZ-3nt0e7RmgIChMEm9OSiC5aj1mHdGT5Pd2f5f6Z3f43qJAA8T2Sqfxb_XkewjuKPc1GGrR9Vvu2mXEhX2ABnFW3wYaU") : SPACER_GIF}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Experience & Affiliations Section */}
        <section className="py-stack-lg bg-surface-container-lowest border-y border-outline-variant/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <h2 className="font-display-lg text-headline-md md:text-headline-lg text-on-surface mb-4">
              A Legacy of Excellence
            </h2>
            <p className="font-body-lg text-on-surface-variant mb-12">
              Proudly associated with industry leaders.
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60">
              <div className="flex flex-col items-center group cursor-default">
                <span className="font-display-lg text-headline-sm grayscale group-hover:grayscale-0 transition-all text-on-surface-variant hover:text-on-surface">
                  Enrich
                </span>
              </div>
              <div className="flex flex-col items-center group cursor-default">
                <span className="font-display-lg text-headline-sm grayscale group-hover:grayscale-0 transition-all text-on-surface-variant hover:text-on-surface">
                  Toni &amp; Guy
                </span>
              </div>
              <div className="flex flex-col items-center gap-4 relative group cursor-default">
                <div className="absolute -top-8 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="font-label-caps text-[10px] text-primary tracking-widest whitespace-nowrap">
                    CURRENT STUDIO
                  </span>
                </div>
                <span className="font-display-lg text-headline-md text-on-surface grayscale-0 font-bold">
                  The Bombay Hair Company
                </span>
              </div>
              <div className="flex flex-col items-center group cursor-default">
                <span className="font-display-lg text-headline-sm grayscale group-hover:grayscale-0 transition-all text-on-surface-variant hover:text-on-surface">
                  Tres Mink Salon
                </span>
              </div>
            </div>

            <div className="mt-16 flex justify-center">
              <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-outline-variant to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Training Academy Section */}
        <section className="py-stack-lg bg-surface-container-low overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="bg-inverse-surface rounded-[2rem] p-margin-mobile md:p-margin-desktop text-surface-bright relative overflow-hidden shadow-2xl">
              {/* Glow Accent */}
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-l from-primary/50 to-transparent"></div>
              </div>
              
              <div className="relative z-10">
                <span className="font-label-caps text-label-caps text-surface-dim tracking-widest mb-4 block">
                  TRAINING ACADEMY
                </span>
                <h2 className="font-display-lg text-headline-md md:text-display-lg text-surface-bright mb-8">
                  Learn from 20+ Years Experience
                </h2>
                
                <div className="grid md:grid-cols-3 gap-gutter mb-12">
                  <div className="border-l border-outline-variant/30 pl-6 py-2">
                    <h4 className="font-headline-sm mb-2 text-surface-bright">Technical Mastery</h4>
                    <ul className="space-y-2 text-surface-dim font-body-md text-body-md leading-relaxed">
                      <li>Hair Cutting &amp; Texturing</li>
                      <li>Advanced Coloring</li>
                      <li>Barber Techniques</li>
                    </ul>
                  </div>
                  <div className="border-l border-outline-variant/30 pl-6 py-2">
                    <h4 className="font-headline-sm mb-2 text-surface-bright">Soft Skills</h4>
                    <ul className="space-y-2 text-surface-dim font-body-md text-body-md leading-relaxed">
                      <li>Client Communication</li>
                      <li>Service Consultation</li>
                      <li>Customer Management</li>
                    </ul>
                  </div>
                  <div className="border-l border-outline-variant/30 pl-6 py-2">
                    <h4 className="font-headline-sm mb-2 text-surface-bright">Career Prep</h4>
                    <ul className="space-y-2 text-surface-dim font-body-md text-body-md leading-relaxed">
                      <li>Salon Operations</li>
                      <li>Grooming Skills</li>
                      <li>Portfolio Building</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <Link href="/academy">
                    <button className="bg-surface-bright text-inverse-surface px-12 py-4 rounded-full font-button-text text-button-text hover:bg-surface-dim transition-all active:scale-95">
                      Enroll for Training
                    </button>
                  </Link>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-4">
                      <div className="w-12 h-12 rounded-full border-2 border-inverse-surface overflow-hidden">
                        <img 
                          className="w-full h-full object-cover" 
                          alt="Student 1" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA97NcXp7d-xkkoaVSNrTNOSXylQNEeKWQ9HPqQmAjVXDntK_KCuelr3kiv0NBSZ4buyIakHN09NmRpIng3BLOdh0gIqdcTngCRbzFB6b4L-PKWmW5XuyNA0w1dQsTw80lxd__I8XUJ9bl4ZIG6wjosM8qow5SWdnQ2ED96Y1UQ9X5m-T0X1HC0afQF3cnWF9AE5qFsedd6XxTi8HitY7OpuiKj1bWRkhOSpVQzyPeFUrfXUPx_owBkdkfWe24azBk-ZqSq6yI6vbI"
                        />
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-inverse-surface overflow-hidden">
                        <img 
                          className="w-full h-full object-cover" 
                          alt="Student 2" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWl40C8jTvd8fj7PGEJUHdZO_kovBWNDWdNF0menKbRs-1H7HzMwrogjZ4Ybi41LCSGmUA_ocz0zhNJ1TOfrzuY0VohYlYKRuRYAq1gJM9FXdeUtg35-BCVt6q3FgzRPMb8a-qVYQ7tmGGSd77eUg0BRc6-nRKxBcy6UM_xBb_fz2ne2iOnEF9mqpxlcfnK-pmlkwpj2aougJKZ_aQWaNGE3K0X5MhmM1ZmiKofH2CNvyYgf1oCrwwWJK6MJihT_OnLoA3i-vqx_c"
                        />
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-inverse-surface overflow-hidden">
                        <img 
                          className="w-full h-full object-cover" 
                          alt="Student 3" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1qVCjfDsTWMlN3ksZVQ7vW4NH5LrSYLrH4bOIGcB_MioNQNoEgXa1ZqNOzt0OKyfU_VkVNRLC5V6HPT1mBg3iJeyio2b-BVZaCbjSjFYkjJ1F70tcJfl5qimwEfzFHYpwK1Qqlv8bFXb9aq6M01f_PC6Uo88n65FVRUGuPba4M0tLZBgaYJO-6r1f-3t1BoBLs4_fC1DOmWdXT5ryzLRrYAJnaS5l-_Z16rUG0rwAwDJ5DA3D47X1Dzkp5ps3ZKte4sgIpOVrMCk"
                        />
                      </div>
                    </div>
                    <span className="text-surface-dim font-label-caps text-xs tracking-wider">
                      JOIN 500+ GRADUATES
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-stack-lg creamy-gradient border-b border-outline-variant/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <span className="font-label-caps text-label-caps text-primary tracking-widest">
                CLIENT VOICES
              </span>
              <h2 className="font-display-lg text-headline-md md:text-headline-lg text-on-surface mt-4">
                The Standard of Satisfaction
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-gutter items-stretch">
              {testimonials.map((t: any, idx: number) => {
                const isBackendImage = t.image && !t.image.startsWith("http");
                const resolvedAvatar = t.image 
                  ? (isBackendImage ? `${API_BASE_URL.replace("/api", "")}${t.image}` : t.image)
                  : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100";
                const avatarUrl = resolvedAvatar?.replace(/\.(heic|heif)$/i, ".jpg");
                return (
                  <GlassCard 
                    key={t._id || idx} 
                    className={`p-stack-sm rounded-2xl flex flex-col justify-between ${
                      idx === 1 ? "md:scale-105 md:-translate-y-2 border-primary/40 shadow-lg" : ""
                    }`}
                  >
                    <div>
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-6 mx-auto border-4 border-surface-bright shadow-md">
                        <img 
                          className="w-full h-full object-cover" 
                          alt={t.clientName} 
                          src={avatarUrl}
                        />
                      </div>
                      <p className="font-body-md text-on-surface-variant italic text-center mb-6 leading-relaxed">
                        &ldquo;{t.feedback}&rdquo;
                      </p>
                      {t.rating && (
                        <div className="flex justify-center gap-1 mb-4 text-primary text-sm">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-center mt-auto">
                      <h4 className="font-headline-sm text-sm font-bold text-on-surface">{t.clientName}</h4>
                      <span className="text-label-caps text-[10px] text-primary tracking-wider uppercase block mt-1">
                        {t.role || "CLIENT"}
                      </span>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <PremiumFooter />
    </>
  );
}
