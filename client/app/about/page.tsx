"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Heart, Sparkles, BookOpen, Star, Scissors, Compass, MessageSquare, ChevronRight } from "lucide-react";
import LuxuryNavbar from "@/components/common/LuxuryNavbar";
import PremiumFooter from "@/components/common/PremiumFooter";
import GlassCard from "@/components/common/GlassCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SPACER_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

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

const timelineEvents = [
  {
    year: "2004 - 2009",
    title: "The Foundations of Precision",
    description: "Began journey focusing on high-end classic barbering and precision scissor work, training with veteran stylists to master the geometric rules of hair weight and balance.",
    icon: Scissors,
  },
  {
    year: "2010 - 2015",
    title: "Mastery & Creative Direction",
    description: "Expanded into luxury women's color chemistry and editorial styling. Directed key collections for fashion campaigns and salon showcases, blending classic techniques with contemporary visual trends.",
    icon: Compass,
  },
  {
    year: "2016 - 2021",
    title: "Academy Foundation & Mentorship",
    description: "Established a professional training curriculum to teach advanced styling mechanics and the art of customer consultation. Mentored over 100 stylists who now run their own successful studios.",
    icon: BookOpen,
  },
  {
    year: "2022 - Present",
    title: "The Atelier & Global Standards",
    description: "Consolidated a bespoke styling atelier focusing on private styling consultations. Combines 20+ years of operational intelligence with high-fashion, custom-designed grooming solutions.",
    icon: Award,
  },
];

export default function About() {
  const [sectionImages, setSectionImages] = useState<Record<string, string>>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
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
    fetchSectionImages();
  }, []);

  return (
    <>
      <LuxuryNavbar />

      <main className="pt-32 pb-stack-lg bg-surface">
        {/* Editorial Bio Hero */}
        <section className="relative min-h-[70vh] flex items-center creamy-gradient py-16 overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-12 gap-12 items-center w-full">

            {/* Bio Hero Text */}
            <motion.div
              className="md:col-span-7 z-10 space-y-6 order-2 md:order-1"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.span
                variants={fadeInUp}
                className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase block"
              >
                THE ARTISAN &amp; VISIONARY
              </motion.span>
              <motion.h1
                variants={fadeInUp}
                className="font-display-lg text-display-lg-mobile md:text-[56px] text-on-surface leading-tight"
              >
                Crafting Personal Identity Through <span className="text-secondary italic">Hair Artistry</span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed"
              >
                Rahul S Tipukade has spent over two decades perfecting the art of hair styling and luxury grooming. Guided by a philosophy that style is an extension of character, he treats every appointment as a collaborative design process.
              </motion.p>

              {/* Profile Meta Cards */}
              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 max-w-md pt-4">
                <GlassCard tiltEnabled={false} className="p-4 rounded-xl border-outline-variant/20">
                  <div className="text-primary font-display-lg text-2xl mb-1">20+ Years</div>
                  <div className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">Active Craftsmanship</div>
                </GlassCard>
                <GlassCard tiltEnabled={false} className="p-4 rounded-xl border-outline-variant/20">
                  <div className="text-primary font-display-lg text-2xl mb-1">Elite</div>
                  <div className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">Certified Mentor</div>
                </GlassCard>
              </motion.div>
            </motion.div>

            {/* Bio Hero Image */}
            <motion.div
              className="md:col-span-5 relative order-1 md:order-2 flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative z-10 w-full max-w-[380px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
                <img
                  alt="Rahul S Tipukade portrait"
                  className="w-full h-full object-cover"
                  src={imagesLoaded ? (sectionImages.about_intro || "https://lh3.googleusercontent.com/aida-public/AB6AXuBXJcqyH6sSDWkiA6z6X5ytVYvnaOFLLvmlJeBRc1CY_6IWlDfDU-kbd-xHOqWdgpygz-0gtPPgf0h4vtpn9TNPe4oCLWuWDHdXTGXsvDe0xzEcswswp6vwY5NfyCujKgsK_PSgcD0bIXmfjAdt-2WFcx68lGcCexWKkznKSy4I_8T-VUe5KqszY3BVHiSegj1IjfDB5lE-eqpS9gM6-BNYUAunSeJnB_95ZWCXjnyNfu2_6HOXT-mtRYYymjDac_nPkGSS0Yo4tVo") : SPACER_GIF}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card px-6 py-4 rounded-lg hidden md:block border-primary/20 z-20">
                <p className="font-display-lg text-lg text-primary">Prestige Barbering</p>
                <p className="font-label-caps text-[9px] text-on-surface-variant tracking-widest">EDITORIAL STYLIST</p>
              </div>

              {/* Ambient light glow */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary-container/30 blur-3xl rounded-full"></div>
            </motion.div>

          </div>
        </section>

        {/* Section: Core Philosophy */}
        <section className="py-stack-lg bg-surface-container-lowest border-y border-outline-variant/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid md:grid-cols-2 gap-12 items-center">

              {/* Image showing craft */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg group">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Stylist performing haircut"
                  src={imagesLoaded ? (sectionImages.about_story || "https://lh3.googleusercontent.com/aida-public/AB6AXuBdWVWEAYui1EGP_Bq5EUXdMBENU9HvGjHWGs8bQ13rpNom2dWvMdoxWyMxV3yRtTXLsz5xSSZBMF6iFL1g2N2Fc2eAkboxNXY-pWrGpoDRMY9_x9rwcMdJ01Vb7qUQAXZycVXOGn4Ox0TJsttszshezZVlBujShuuIPXsqXy-jrA-X4Vm1YPwsHUu3LLDnte91kdSvQ_-pQbv3f7QGhkZ3Qz776lTPniIfndhfQO6w_cVy04z4Yt_RvI_rVc7gCkntFYVWyAReHIY") : SPACER_GIF}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
                  <span className="font-label-caps text-[10px] text-white tracking-widest uppercase">THE ATELIER EXPERIENCE</span>
                </div>
              </div>

              {/* Philosophy text */}
              <div className="space-y-6">
                <span className="font-label-caps text-label-caps text-primary tracking-widest block">THE PHILOSOPHY</span>
                <h2 className="font-display-lg text-headline-md md:text-headline-lg text-on-surface">
                  Structure, Geometry &amp; Flow
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Every haircut is an architectural structure built on the unique canvas of a client's bone shape, hair weight, growth patterns, and personal lifestyle. Rahul combines standard styling with advanced structural modeling to ensure hair looks excellent not just when leaving the studio, but as it naturally grows over weeks.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Consultation is the most vital step of the craft. Before a single cut is made, a professional dialog aligns the client's self-image with custom geometry, selecting elements that bring out natural symmetry and effortless style.
                </p>

                {/* Core Pillars */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-primary shrink-0" />
                    <span className="font-label-caps text-xs text-on-surface tracking-wider">Custom Geometry</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart size={16} className="text-primary shrink-0" />
                    <span className="font-label-caps text-xs text-on-surface tracking-wider">Organic Flow</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-primary shrink-0" />
                    <span className="font-label-caps text-xs text-on-surface tracking-wider">High Precision</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} className="text-primary shrink-0" />
                    <span className="font-label-caps text-xs text-on-surface tracking-wider">Artful Dialogue</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section: Timeline of Mastery */}
        <section className="py-stack-lg bg-surface">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-label-caps text-label-caps text-primary tracking-widest block mb-4">THE JOURNEY</span>
              <h2 className="font-display-lg text-headline-md md:text-headline-lg text-on-surface">
                Two Decades in the Making
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                A chronicle of refinement, training, and operational leadership.
              </p>
            </div>

            {/* Desktop Timeline */}
            <div className="relative max-w-4xl mx-auto hidden md:block">
              {/* Vertical line through center */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-outline-variant/40 hidden md:block"></div>

              <div className="space-y-12">
                {timelineEvents.map((evt, idx) => {
                  const Icon = evt.icon;
                  const isEven = idx % 2 === 0;

                  return (
                    <div key={idx} className="relative flex flex-col md:flex-row items-center">

                      {/* Left content or placeholder */}
                      <div className={`w-full md:w-1/2 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:order-2 text-left"}`}>
                        <span className="font-display-lg text-headline-sm text-primary font-bold block mb-2">{evt.year}</span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">{evt.title}</h3>
                        <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                          {evt.description}
                        </p>
                      </div>

                      {/* Center Point Icon */}
                      <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-surface-container border border-primary/30 flex items-center justify-center text-primary z-10 hidden md:flex shadow-sm">
                        <Icon size={16} />
                      </div>

                      {/* Right content or placeholder */}
                      <div className={`w-full md:w-1/2 hidden md:block ${isEven ? "md:order-2" : ""}`}></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile simplified stack list */}
            <div className="space-y-8 md:hidden mt-8">
              {timelineEvents.map((evt, idx) => {
                const Icon = evt.icon;
                return (
                  <GlassCard key={idx} className="p-6 rounded-xl border-outline-variant/30 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="font-display-lg text-headline-sm text-primary font-bold block mb-1">{evt.year}</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{evt.title}</h3>
                      <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

          </div>
        </section>

        {/* Section: Operational Values */}
        <section className="py-stack-lg bg-surface-container-lowest border-t border-outline-variant/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid md:grid-cols-3 gap-gutter items-center">

              <div className="md:col-span-1 space-y-4">
                <span className="font-label-caps text-label-caps text-primary tracking-widest block">CORE STANDARDS</span>
                <h2 className="font-display-lg text-headline-md md:text-headline-lg text-on-surface">
                  Professional Competencies
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Studiocentric operations are driven by client comfort, multi-lingual accessibility, and sterile grooming standards.
                </p>
              </div>

              <div className="md:col-span-2 grid sm:grid-cols-2 gap-gutter">
                <GlassCard className="p-6 rounded-xl" tiltEnabled={false}>
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary mb-4">
                    <Award size={18} />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm mb-2 text-on-surface">Linguistic Adaptability</h3>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    Fluent in English, Hindi, Marathi, and Kannada. This allows for deep styling consultation across diverse demographic structures without miscommunication.
                  </p>
                </GlassCard>

                <GlassCard className="p-6 rounded-xl" tiltEnabled={false}>
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary mb-4">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm mb-2 text-on-surface">Clinical Sterilization</h3>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    Strict adherence to tools sterilization, disposable capes, and vacuum dust filtration to guarantee a clinical level of hygiene at every service.
                  </p>
                </GlassCard>

                <GlassCard className="p-6 rounded-xl" tiltEnabled={false}>
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary mb-4">
                    <BookOpen size={18} />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm mb-2 text-on-surface">Academy Accreditation</h3>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    Provides certification training in luxury salon design, razor technique, client management, and product shelf strategy to up-and-coming hair professionals.
                  </p>
                </GlassCard>

                <GlassCard className="p-6 rounded-xl" tiltEnabled={false}>
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary mb-4">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm mb-2 text-on-surface">Bespoke Chemistry</h3>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    Consults directly on organic hair tonic, botanical colorants, and custom oil infusions tailored precisely to the client's specific scalp chemistry.
                  </p>
                </GlassCard>
              </div>

            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="py-stack-lg px-margin-mobile">
          <div className="max-w-container-max mx-auto relative overflow-hidden glass-card p-12 md:p-24 text-center rounded-2xl border-outline-variant/30 bg-white/70">
            {/* Grid background lines */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
              <div className="grid grid-cols-6 h-full w-full border-r border-primary">
                <div className="border-r border-primary h-full"></div>
                <div className="border-r border-primary h-full"></div>
                <div className="border-r border-primary h-full"></div>
                <div className="border-r border-primary h-full"></div>
                <div className="border-r border-primary h-full"></div>
              </div>
            </div>

            <h2 className="font-display-lg text-headline-md md:text-headline-lg text-primary mb-6 uppercase tracking-wider">
              Experience the Luxury of Precision
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether seeking a signature styling update or professional technical education, step into a workspace built on excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/booking">
                <button className="px-10 py-4 bg-inverse-surface text-surface-bright font-label-caps text-xs tracking-widest hover:opacity-90 transition-all rounded-full flex items-center gap-2 active:scale-95 shadow-md">
                  BOOK AN APPOINTMENT
                  <ChevronRight size={14} />
                </button>
              </Link>
              <Link href="/academy">
                <button className="px-10 py-4 border border-primary text-primary font-label-caps text-xs tracking-widest hover:bg-primary/10 transition-all rounded-full flex items-center gap-2 active:scale-95">
                  EXPLORE ACADEMY
                  <ChevronRight size={14} />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PremiumFooter />
    </>
  );
}
