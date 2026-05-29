"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Scissors, Smile, Palette, Wand2, Crown, Leaf, Star, Shield, ArrowRight, CheckCircle } from "lucide-react";
import LuxuryNavbar from "@/components/common/LuxuryNavbar";
import PremiumFooter from "@/components/common/PremiumFooter";
import GlassCard from "@/components/common/GlassCard";
import { servicesData } from "@/data/services";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SPACER_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const iconMap = {
  scissors: Scissors,
  smile: Smile,
  palette: Palette,
  wand: Wand2,
  crown: Crown,
  leaf: Leaf,
  star: Star,
  shield: Shield,
};

export default function Services() {
  const [services, setServices] = useState<any[]>(servicesData);
  const [sectionImages, setSectionImages] = useState<Record<string, string>>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/services`);
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
                price: item.price,
                iconName: item.icon || "scissors",
                image: normalizedImage
              };
            });
            // IconName-based replacement
            const staticList = [...servicesData];
            const replacedIndices = new Set();
            const extraDbItems: typeof mapped = [];

            mapped.forEach((m: any) => {
              const staticIndex = staticList.findIndex(
                (s, idx) => s.iconName === m.iconName && !replacedIndices.has(idx)
              );
              if (staticIndex !== -1) {
                replacedIndices.add(staticIndex);
                staticList[staticIndex] = m;
              } else {
                extraDbItems.push(m);
              }
            });

            const merged = [...staticList, ...extraDbItems];
            setServices(merged);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch services, using static fallbacks:", err);
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

    fetchServices();
    fetchSectionImages();
  }, []);

  return (
    <>
      <LuxuryNavbar />

      <main className="pt-32 pb-stack-lg bg-surface">
        {/* Page Header */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            
            <motion.div 
              className="lg:col-span-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-label-caps text-label-caps text-secondary mb-4 block uppercase tracking-widest">
                The Art of Grooming
              </span>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-6">
                Signature Services
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
                Experience precision and luxury at our private atelier. Every service is a bespoke journey tailored to your unique aesthetic and lifestyle.
              </p>
            </motion.div>

            <motion.div 
              className="lg:col-span-6 relative flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl w-full max-w-[550px]">
                <img
                  className="w-full h-full object-cover"
                  alt="Atelier interior"
                  src={imagesLoaded ? (sectionImages.services_hero || "https://lh3.googleusercontent.com/aida-public/AB6AXuDFOtXhlspiofLCUHcklCu9LbG874-VizlOiMWMP7KvIKbg7zB8HNu-lNzqnB1io-JyqK1xMp4DZ9G9wyYJs8rgXX11TJ7wO-_Yg-8hs_IV_CEUId66dvDY9dsnmnMEKtZGU9s6p4zIwYeSF1crug0f0f6pTcwexuOPpEl3XVwHtUmHYWF5yGdSUx2mFmQwQALjxv5w_MtpMBuqUqjrdlfcJpo2m_2R2TjPaEA2bMiovr8porjedVGA-6aUJbawo8RJojwnT9pjQ_s") : SPACER_GIF}
                />
              </div>
              <GlassCard className="absolute -bottom-6 -left-6 hidden lg:block p-6 rounded-xl max-w-xs border-primary/20 shadow-lg">
                <p className="font-display-lg text-headline-sm text-on-surface italic leading-relaxed">
                  &ldquo;Excellence is in the details.&rdquo;
                </p>
              </GlassCard>
            </motion.div>

          </div>
        </section>

        {/* Services List Grid */}
        <section className="bg-surface-container-low/30 py-stack-lg border-y border-outline-variant/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {services.map((service, idx) => {
                const IconComponent = iconMap[service.iconName as keyof typeof iconMap] || Scissors;
                return (
                  <GlassCard
                    key={service.id}
                    className="p-gutter rounded-xl flex flex-col justify-between group hover:border-primary/50 transition-all duration-300"
                  >
                    <div>
                      {service.image ? (
                        <div className="aspect-video w-full rounded-lg overflow-hidden mb-6 border border-outline-variant/10 bg-surface-container">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                          <IconComponent size={20} />
                        </div>
                      )}
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                        {service.title}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-outline-variant/30 w-full">
                      <span className="font-body-md text-body-md font-semibold text-primary">
                        {service.price === "Inquiry Only" ? "Inquiry Only" : `From ${service.price}`}
                      </span>
                      <ArrowRight size={16} className="text-outline group-hover:translate-x-1 transition-transform group-hover:text-primary" />
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Detail Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-md items-center">
            
            {/* Image Grid */}
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-gutter">
                <div className="aspect-square rounded-xl overflow-hidden mt-12 shadow-lg relative group">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt="Precision styling process"
                    src={imagesLoaded ? (sectionImages.services_process_1 || "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ewkVjKcaei3A5dApx6Id5PKlhUZL9Sfx-8k8hQjD518YP1IGvCKVgU1Xiix5Cp9zLPvHJOn6AX_V7BsuhnhDYwNS_-64DXO-P4FaaSQEYHAvwMiohdkVdaLbYBVUD4DGkioBelJXJ4ctNDfzl-2qDPEu-7mLZrQrKOVuhSzOVO-P9VOthrtbrksuMgBlykrt_5ZfMUcd9Au5klc0GQdv_BWN3auHVIYn-OHynTFHakWE1VkvYcv-KCdUrwjWbS1AWx5eNtKmnqk") : SPACER_GIF}
                  />
                </div>
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg relative group">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt="Premium styling tools"
                    src={imagesLoaded ? (sectionImages.services_process_2 || "https://lh3.googleusercontent.com/aida-public/AB6AXuAvlnYURueXIbIlScp5wjXBlBFjw8Y5eRHdmGYKpZ01EWJzxxE9kHnNaiT9Wz02SKKWOajupO-a1BpUT0SaLi2b915nzh_ndtr_W_3S3qo0Qhraj_ISQ47OYJYjFmOY1iiNoOIIxha59qPiO_USz947VDm_bOCrpGKWXzdkjFsOslFcC9k01jIijvlooA-N06ePJ0-0Mjgwt2jgHr3w8qrSQypKSCCCPsYbtnvfs4TdA3B2Pug4n7uyO9S5sVcIh5FQBb56GZZ92TU") : SPACER_GIF}
                  />
                </div>
              </div>
            </div>

            {/* Content Text */}
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="font-display-lg text-headline-md text-on-surface">
                The Atelier Experience
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Our service transcends the chair. From the moment you step into our creamy-white sanctuary, every sense is catered to.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-on-surface">
                  <CheckCircle size={18} className="text-primary shrink-0" />
                  <span className="font-body-md text-body-md">Complimentary artisanal coffee &amp; tea service</span>
                </li>
                <li className="flex items-center gap-4 text-on-surface">
                  <CheckCircle size={18} className="text-primary shrink-0" />
                  <span className="font-body-md text-body-md">Private 1-on-1 sessions for maximum focus</span>
                </li>
                <li className="flex items-center gap-4 text-on-surface">
                  <CheckCircle size={18} className="text-primary shrink-0" />
                  <span className="font-body-md text-body-md">Personalized aromatherapy scalp massage</span>
                </li>
              </ul>
              
              <div className="pt-6">
                <Link 
                  href="/academy" 
                  className="font-button-text text-button-text text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-all"
                >
                  Explore our training academy →
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Grooming Consultation Detail block */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg">
          <div className="relative overflow-hidden bg-surface-container-highest rounded-xl p-stack-lg md:p-24 flex flex-col md:flex-row items-center gap-12 shadow-xl border border-outline-variant/20">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary filter blur-[120px] -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary filter blur-[100px] -ml-32 -mb-32 opacity-40"></div>
            </div>

            <div className="relative z-10 w-full md:w-1/2">
              <h2 className="font-display-lg text-headline-md md:text-headline-lg text-primary mb-6">
                Professional Grooming Consultation
              </h2>
              <p className="text-on-surface-variant font-body-lg text-body-lg mb-8 leading-relaxed">
                True grooming is more than a service—it&apos;s an identity. Our master consultants analyze your hair texture, facial geometry, and personal style to create a roadmap for your aesthetic journey. We don&apos;t just cut hair; we curate presence.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-on-surface font-body-md text-body-md">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>
                  <span>Personalized facial structure analysis</span>
                </li>
                <li className="flex items-center gap-3 text-on-surface font-body-md text-body-md">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>
                  <span>Long-term hair health planning</span>
                </li>
                <li className="flex items-center gap-3 text-on-surface font-body-md text-body-md">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>
                  <span>Product recommendation for maintenance</span>
                </li>
              </ul>
              <Link href="/booking">
                <button className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 shadow-md hover:opacity-90 transition-all active:scale-95">
                  SCHEDULE YOURS NOW
                </button>
              </Link>
            </div>
            
            <div className="relative z-10 w-full md:w-1/2 aspect-square md:aspect-auto h-[400px] rounded-lg overflow-hidden border border-outline-variant/30 shadow-lg">
              <img
                className="w-full h-full object-cover"
                alt="Stylist consulting client"
                src={imagesLoaded ? (sectionImages.services_consultation || "https://lh3.googleusercontent.com/aida-public/AB6AXuAOeMw0Leqi1jNmuJsgaQ14CKS7haszjq2gohw-Gobh1k-jOdGv11R8WulW9k-hK9gGgaEiH3VUpgibBAocXRtetJkvME526BN3bvlM8SDFCLWtDvUOpMstdyX3AMaj1p8XFqP5CFG1PXerWS1Ro9oueJmUDZsWYyeNOww5o04Aea3G0orS4iHsH9VGkfVIafHRU_TNrWL1TwhsKYRU6xO_jCedlPmsPa4Ih_1oPzDzb9qwLFlzMq8TuWI5Cqq51ZaSOqxtFq9vKnY") : SPACER_GIF}
              />
            </div>
          </div>
        </section>

        {/* Global CTA Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-stack-lg">
          <div className="bg-secondary-container/30 border border-outline-variant/30 rounded-3xl p-stack-lg text-center shadow-sm">
            <h2 className="font-display-lg text-headline-md md:text-headline-lg text-on-surface mb-4">
              Elevate Your Image Today
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
              Ready for a transformation that defines your personal brand? Book your session at the atelier.
            </p>
            <Link href="/booking">
              <button className="bg-on-surface text-surface px-10 py-4 rounded-full font-button-text text-button-text hover:opacity-90 active:scale-95 transition-all shadow-md">
                Schedule Your Consultation
              </button>
            </Link>
          </div>
        </section>
      </main>

      <PremiumFooter />
    </>
  );
}
