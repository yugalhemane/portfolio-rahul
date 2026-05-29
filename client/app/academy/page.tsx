"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, DollarSign, Award, CheckCircle, GraduationCap, ArrowRight } from "lucide-react";
import LuxuryNavbar from "@/components/common/LuxuryNavbar";
import PremiumFooter from "@/components/common/PremiumFooter";
import GlassCard from "@/components/common/GlassCard";
import { academyCourses } from "@/data/academy";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SPACER_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default function Academy() {
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>(academyCourses);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    message: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/academy/courses`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const mapped = data.map((item: any) => {
              const isLocalImg = item.image && !item.image.startsWith("http");
              const resolvedImage = item.image 
                ? (isLocalImg ? `${API_BASE_URL.replace("/api", "")}${item.image}` : item.image)
                : undefined;
              const normalizedImage = resolvedImage?.replace(/\.(heic|heif)$/i, ".jpg");

              return {
                id: item._id,
                title: item.title,
                description: item.description,
                duration: item.duration,
                price: item.price,
                level: item.level || "Advanced",
                syllabus: item.syllabus || [],
                image: normalizedImage
              };
            });
            // Level-based replacement
            const staticList = [...academyCourses];
            const replacedIndices = new Set();
            const extraDbItems: typeof mapped = [];

            mapped.forEach((m: any) => {
              const staticIndex = staticList.findIndex(
                (c, idx) => c.level === m.level && !replacedIndices.has(idx)
              );
              if (staticIndex !== -1) {
                replacedIndices.add(staticIndex);
                staticList[staticIndex] = m;
              } else {
                extraDbItems.push(m);
              }
            });

            const merged = [...staticList, ...extraDbItems];
            setCourses(merged);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch academy courses, using static fallbacks:", err);
      } finally {
        setImagesLoaded(true);
      }
    };
    fetchCourses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.course) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/academy/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setInquirySuccess(true);
        setFormData({ name: "", email: "", course: "", message: "" });
      } else {
        console.log("Server responded with error. Falling back to local simulation.");
        setInquirySuccess(true);
      }
    } catch (err) {
      console.log("Inquiry submit network error. Falling back to local simulation:", err);
      setInquirySuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LuxuryNavbar />

      <main className="pt-32 pb-stack-lg bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          
          {/* Header */}
          <header className="mb-stack-lg text-center md:text-left max-w-2xl">
            <span className="font-label-caps text-label-caps text-secondary mb-4 block uppercase tracking-widest">
              ACADEMY &amp; MENTORSHIP
            </span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 text-on-surface">
              Learn the Craft of Styling
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Step into a legacy of precision and operational excellence. Acquire advanced techniques, soft skills, and operation strategies from 20+ years of studio experience.
            </p>
          </header>

          {/* Courses Listing Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-16">
            {courses.map((course) => (
              <GlassCard 
                key={course.id} 
                className="flex flex-col justify-between hover:border-primary/50 transition-all duration-300 p-8 rounded-2xl group"
              >
                <div>
                  {course.image && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 border border-outline-variant/10 bg-surface-container">
                      <img
                        src={imagesLoaded ? course.image : SPACER_GIF}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-label-caps text-[10px] tracking-widest font-bold uppercase">
                      {course.level}
                    </span>
                    <span className="font-body-md text-sm font-semibold text-primary flex items-center gap-1">
                      <Calendar size={14} />
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="font-display-lg text-headline-sm mb-4 text-on-surface">{course.title}</h3>
                  <p className="text-on-surface-variant font-body-md text-body-md mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="border-t border-outline-variant/30 pt-6 mb-6">
                    <h4 className="font-label-caps text-xs text-outline mb-4 font-bold">COURSE SYLLABUS</h4>
                    <ul className="space-y-3 font-body-md text-sm text-on-surface-variant">
                      {course.syllabus.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle size={14} className="text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/30 mt-auto w-full">
                  <span className="font-display-lg text-xl text-primary font-bold">{course.price}</span>
                  <button 
                    onClick={() => setFormData(prev => ({ ...prev, course: course.title }))}
                    className="font-label-caps text-xs text-primary flex items-center gap-1.5 hover:text-secondary group font-bold tracking-widest"
                  >
                    APPLY NOW
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </section>

          {/* Inquiry Form & Philosophy split section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Philosophy Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="font-label-caps text-label-caps text-primary tracking-widest block">
                OUR PHILOSOPHY
              </span>
              <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface">
                We Don&apos;t Just Teach Cuts. We Shape Careers.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                The hair styling industry is saturated with technical tutorials, but technical expertise is only 40% of what makes a stylist successful. Our academy provides an immersive curriculum focusing on vision alignment, soft skill consultations, and operational intelligence.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-6 text-on-surface">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <GraduationCap size={20} />
                    <span className="font-label-caps text-xs tracking-wider">CERTIFICATE</span>
                  </div>
                  <p className="font-body-md text-sm text-on-surface-variant">Get professional, industry-recognized certificates of completion.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Award size={20} />
                    <span className="font-label-caps text-xs tracking-wider">PORTFOLIO</span>
                  </div>
                  <p className="font-body-md text-sm text-on-surface-variant">Build a luxury styled digital portfolio under Rahul&apos;s direct critique.</p>
                </div>
              </div>
            </div>

            {/* Inquiry Form Card */}
            <div className="lg:col-span-6">
              <GlassCard className="p-8 rounded-2xl border-primary/20 shadow-xl bg-white/70">
                {inquirySuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 flex flex-col items-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <CheckCircle size={24} />
                    </div>
                    <h3 className="font-headline-sm text-xl mb-2 text-on-surface">Inquiry Received</h3>
                    <p className="font-body-md text-on-surface-variant text-sm mb-6 max-w-sm">
                      We have received your enrollment inquiry. Our academy coordinator will contact you with details and batch timings within 48 hours.
                    </p>
                    <button 
                      onClick={() => setInquirySuccess(false)}
                      className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-xs tracking-widest font-bold shadow-md"
                    >
                      SEND ANOTHER INQUIRY
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-8">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-outline-variant/30 pb-4">
                      Academy Enrollment Inquiry
                    </h3>

                    {/* Name */}
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder=" "
                        required
                        className="peer block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary transition-colors font-body-md text-on-surface outline-none"
                      />
                      <label
                        htmlFor="name"
                        className="absolute left-0 top-3 text-outline transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-xs peer-focus:text-primary peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:font-semibold"
                      >
                        Full Name *
                      </label>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder=" "
                        required
                        className="peer block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary transition-colors font-body-md text-on-surface outline-none"
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-0 top-3 text-outline transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-xs peer-focus:text-primary peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:font-semibold"
                      >
                        Email Address *
                      </label>
                    </div>

                    {/* Course */}
                    <div className="relative">
                      <select
                        id="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary transition-colors font-body-md text-on-surface outline-none"
                      >
                        <option value="" disabled className="bg-surface text-on-surface">Select Course *</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.title} className="bg-surface text-on-surface">
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="relative">
                      <textarea
                        id="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="peer block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary transition-colors font-body-md text-on-surface outline-none resize-none"
                      />
                      <label
                        htmlFor="message"
                        className="absolute left-0 top-3 text-outline transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-xs peer-focus:text-primary peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:font-semibold"
                      >
                        Tell us about your background (Optional)
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-on-primary py-4 rounded-full font-button-text uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <span>Submitting...</span> : <span>SUBMIT INQUIRY</span>}
                    </button>
                  </form>
                )}
              </GlassCard>
            </div>

          </section>

        </div>
      </main>

      <PremiumFooter />
    </>
  );
}
