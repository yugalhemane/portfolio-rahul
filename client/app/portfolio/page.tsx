"use client";

import { useState, useEffect, useRef, MouseEvent, TouchEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronRight, Sparkles } from "lucide-react";
import LuxuryNavbar from "@/components/common/LuxuryNavbar";
import PremiumFooter from "@/components/common/PremiumFooter";
import GlassCard from "@/components/common/GlassCard";
import { instagramPosts } from "@/data/gallery";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SPACER_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function getEmbedUrl(url: string): { type: "video" | "iframe"; embedUrl: string; thumbnailUrl?: string } {
  if (!url) return { type: "video", embedUrl: "" };

  const cleanUrl = url.trim();

  // YouTube checks
  if (cleanUrl.includes("youtube.com/watch") || cleanUrl.includes("youtu.be") || cleanUrl.includes("youtube.com/shorts")) {
    let videoId = "";
    if (cleanUrl.includes("youtube.com/watch")) {
      const urlParts = cleanUrl.split("?")[1] || "";
      const urlParams = new URLSearchParams(urlParts);
      videoId = urlParams.get("v") || "";
    } else if (cleanUrl.includes("youtu.be")) {
      videoId = cleanUrl.split("/").pop()?.split("?")[0] || "";
    } else if (cleanUrl.includes("youtube.com/shorts")) {
      videoId = cleanUrl.split("/shorts/")[1]?.split("?")[0] || "";
    }
    return {
      type: "iframe",
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    };
  }

  // Instagram checks
  if (cleanUrl.includes("instagram.com/reel/") || cleanUrl.includes("instagram.com/p/")) {
    let shortcode = "";
    if (cleanUrl.includes("instagram.com/reel/")) {
      shortcode = cleanUrl.split("/reel/")[1]?.split("/")[0] || "";
    } else if (cleanUrl.includes("instagram.com/p/")) {
      shortcode = cleanUrl.split("/p/")[1]?.split("/")[0] || "";
    }
    return {
      type: "iframe",
      embedUrl: `https://www.instagram.com/reel/${shortcode}/embed/`,
      thumbnailUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500"
    };
  }

  return { type: "video", embedUrl: cleanUrl };
}

interface UnifiedGalleryItem {
  id: string;
  title: string;
  category: string;
  categoryLabel?: string;
  image?: string;
  videoUrl?: string;
  before?: string;
  after?: string;
  description?: string;
  aspect?: string;
}

const staticUnifiedItems: UnifiedGalleryItem[] = [
  {
    id: "item-1",
    title: "Signature Precision Cut",
    category: "cuts",
    categoryLabel: "Precision Cuts",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI4-dSghaD4p7AlO-K30DRyb4c4bBV_KEUxHyVJ69S_GXScnm48j-vdSf85wFDMvgHNrBgcTGBos9bg0uZP2JSOk11E28ZTRCuRwzRFjSQISf6jjd6zB4UVE4XaNGK33oz9_i-8MAsQigI2leXE3nt2WwYvBWAG8oDIk4cpoxNOBZkae-cutif1tV8Ju6OfcBs8hRbry2M-NOe4J5iDWGNIsf230NzGg-50fcoUEEQ7_DvJ93UuJwtJqqQKGPvpi7fqxttJp3qFuo",
    aspect: "tall"
  },
  {
    id: "trans-1",
    title: "Signature Pompadour Transformation",
    category: "transformations",
    categoryLabel: "TRANSFORMATION",
    before: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwG9AioRBKZkcYzmOzRmW7aDgi6Ur3vOvj5X6A5BXi0qMXceWV5j9IXwaT_XuV2EAtGE7T140KxXMJN46isQx_pPUzloT4bu626U6AuiKd2E-9qkB39V4FnuUBL8BN8Z40tuEHfnKSXcstwqF2uVjnF4ENaBckfoFPatOtDboaLDPZ5qvYOXZU7KU--HbjzjwG-l1osvyS7uryajaw_KUaoRGVMc19YuyJ25wV_V7YHOBYwYKe8sTsyCO5ebtSeey6iAaxVaC5nPA",
    after: "https://lh3.googleusercontent.com/aida-public/AB6AXuBowznbSvls8WwbaA_i73BuePK3S8nJqtLMH1BCKWLfCC3X3ewbxxEgFMjZMM2qzem47Tgb1-5ovVkL3igbMJmjRal8oVDvKNKM4upY_2AMGWqeijtZlPJf8KTibCwKLPHNYwyMPYHntZig49fu3kjxQLpBEWJwDjmhDQ3L7GoNorsMu_PC31HS8R5F9nHrMC-79M4qW-S9YgmRxczSWb6OqN8FtsBf0qGjeVDUYqcMNltXePoCO29BxzZkpGlOw5s3rcbrWHIAAbk",
    description: "Full volume redesign, hair texturing, and sharp temple fade."
  },
  {
    id: "reel-1",
    title: "The Sculpting Process",
    category: "reels",
    categoryLabel: "REEL",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRz1wrYjkxMsx21n7qax0ZZz-NjdkSvI_-27fCnFqSG0n95jhspvctBrMlok0V7y2fpULilLt9da7hVFxAq_wWXE1Y49ztvV7sPAimNqCIieks3SuwfRKH3a7seTcxzWyc9ogvSH1GKRPE96xfm9-L-8QRYckavfRCwAi3k4Ozl4bv-6RyIMopIBtPPwuGF9RWfWWLjTyTlrseylfPF8Et9HrP8YYtGkhD-spSOUKBqGwtXUmN6fxkvS2FUOHLMbzQKm82Us2yfYQ",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-barber-cutting-hair-with-shears-43093-large.mp4"
  },
  {
    id: "item-2",
    title: "Modern Matte Texture",
    category: "styling",
    categoryLabel: "Editorial Styling",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuClARbpHFnwO2nUaN5Kjeq7zOY_Nfw6iYmgRYVYmRtf7_VWyyzChSGAsKYpFZ1FMkCrfFvmEu7qZZQmu3uQKf7KZ52ToEDRftXn86XTqbiplK9a3quFHUTevXu36Q3W42QoID2attXYOUWqncJY1ISF2eunwOhsRW8CNvP_NNw18cWF63VtRgxUMN58W7f9vImuo54PYDjf5uYXvi62cS7D1NrPCI5ZUm_qRsqbstTPiktYmsTKp9fkGinK1BapTN6Mwki1bAI-qpc",
    aspect: "square"
  },
  {
    id: "item-3",
    title: "Classic Refinement Cut",
    category: "cuts",
    categoryLabel: "Precision Cuts",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB-CU6oyQNHYj5mjJo3xDXFCAwMTx8U1zFwBfMiCRHTkDKN0xj0_7iJNR_4IQxWWk-4ft3soZNcpUi9guA9Xkwc_L929MKjBylrh5eBul6jelzXkb3BUag9noNP2dZXnTyKHjeuxi4YHZNSu3UFuJp78-YQzSCBxDWwz3PPwmbuM5kBnkXaVVI82xwCDtBZwFeWJkgvpNXpwGJ-xcvrD1nfRUjOsb2woUCIChxwhNdOmbWhnE7bD3Ufl65GEc9CuAyot4ASKPIbgM",
    aspect: "tall"
  },
  {
    id: "item-4",
    title: "The Atelier Sanctuary",
    category: "studio",
    categoryLabel: "Our Studio",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJJlSzSUW6JeSjo6L5GyUd5G85h8GQDPOd4iC7LKNHA7sbLh9cIisAevq_OF7OvZxcoZDvwhDp6-LC8j67m-fj2wSeUX-sNNpKhvaQf5fzk89q8BO04ebJIkI-xCTiHavtv2d-szvSwGTXAR3l3R3kDZxhlNprgZI667bRsXFDaiFdWROlRa9WvVeyJlCSxxbTI5w9gKHiyYGd-9MYTtUkS4bVwYRmZEGjdyDJqSIcva8hbrr2W1T5aiARCH9V_pRlOibhhDVZQvM",
    aspect: "tall"
  }
];

export default function Portfolio() {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<UnifiedGalleryItem[]>(staticUnifiedItems);
  const [sectionImages, setSectionImages] = useState<Record<string, string>>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [dbInstagramPosts, setDbInstagramPosts] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Section Images
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
        }

        // Fetch Gallery Items
        try {
          const res = await fetch(`${API_BASE_URL}/gallery`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              // Extract Instagram Posts
              const instagramItems = data.filter((item: any) => item.category === "instagram");
              if (instagramItems.length > 0) {
                const urls = instagramItems.map((item: any) => {
                  const isLocalImg = item.imageUrl && !item.imageUrl.startsWith("http");
                  return item.imageUrl
                    ? (isLocalImg ? `${API_BASE_URL.replace("/api", "")}${item.imageUrl}` : item.imageUrl)
                    : item.videoUrl || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500";
                });
                setDbInstagramPosts(urls);
              }

              // Filter out instagram category items for the main gallery list
              const nonInstagramData = data.filter((item: any) => item.category !== "instagram");

              const mapped = nonInstagramData.map((item: any) => {
                // Convert HEIC/HEIF urls to .jpg dynamically for browser rendering
                let rawImageUrl = item.imageUrl || "";
                if (rawImageUrl && /\.(heic|heif)$/i.test(rawImageUrl)) {
                  rawImageUrl = rawImageUrl.replace(/\.(heic|heif)$/i, ".jpg");
                }

                let rawBeforeImageUrl = item.beforeImageUrl || "";
                if (rawBeforeImageUrl && /\.(heic|heif)$/i.test(rawBeforeImageUrl)) {
                  rawBeforeImageUrl = rawBeforeImageUrl.replace(/\.(heic|heif)$/i, ".jpg");
                }

                let rawAfterImageUrl = item.afterImageUrl || "";
                if (rawAfterImageUrl && /\.(heic|heif)$/i.test(rawAfterImageUrl)) {
                  rawAfterImageUrl = rawAfterImageUrl.replace(/\.(heic|heif)$/i, ".jpg");
                }

                const isLocalImg = rawImageUrl && !rawImageUrl.startsWith("http");
                const imageUrl = rawImageUrl
                  ? (isLocalImg ? `${API_BASE_URL.replace("/api", "")}${rawImageUrl}` : rawImageUrl)
                  : undefined;

                const isLocalBefore = rawBeforeImageUrl && !rawBeforeImageUrl.startsWith("http");
                const beforeUrl = rawBeforeImageUrl
                  ? (isLocalBefore ? `${API_BASE_URL.replace("/api", "")}${rawBeforeImageUrl}` : rawBeforeImageUrl)
                  : undefined;

                const isLocalAfter = rawAfterImageUrl && !rawAfterImageUrl.startsWith("http");
                const afterUrl = rawAfterImageUrl
                  ? (isLocalAfter ? `${API_BASE_URL.replace("/api", "")}${rawAfterImageUrl}` : rawAfterImageUrl)
                  : undefined;

                const isLocalVideo = item.videoUrl && !item.videoUrl.startsWith("http");
                const videoUrl = item.videoUrl
                  ? (isLocalVideo ? `${API_BASE_URL.replace("/api", "")}${item.videoUrl}` : item.videoUrl)
                  : undefined;

                return {
                  id: item._id,
                  title: item.title,
                  category: item.category,
                  categoryLabel: item.category === "cuts" ? "Precision Cuts" :
                    item.category === "colors" ? "Advanced Coloring" :
                      item.category === "styling" ? "Editorial Styling" :
                        item.category === "bridal" ? "Bridal Styling" :
                          item.category === "grooming" ? "Grooming Heritage" :
                            item.category === "studio" ? "Our Studio" :
                              item.category === "reels" ? "REEL" : "TRANSFORMATION",
                  image: imageUrl || beforeUrl || (videoUrl ? getEmbedUrl(videoUrl).thumbnailUrl : undefined) || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500",
                  videoUrl,
                  before: beforeUrl,
                  after: afterUrl,
                  description: item.description,
                  aspect: item.category === "studio" || item.category === "cuts" ? "tall" : "square"
                };
              });
              // Category-based replacement
              const staticList = [...staticUnifiedItems];
              const replacedIndices = new Set();
              const extraDbItems: typeof mapped = [];

              mapped.forEach((m: any) => {
                const staticIndex = staticList.findIndex(
                  (s, idx) => s.category === m.category && !replacedIndices.has(idx)
                );
                if (staticIndex !== -1) {
                  replacedIndices.add(staticIndex);
                  staticList[staticIndex] = m;
                } else {
                  extraDbItems.push(m);
                }
              });

              const merged = [...staticList, ...extraDbItems];
              setGalleryItems(merged);
            }
          }
        } catch (err) {
          console.warn("Failed to fetch gallery, using static fallbacks:", err);
        }
      } finally {
        setImagesLoaded(true);
      }
    };
    loadData();
  }, []);

  return (
    <>
      <LuxuryNavbar />

      <main className="pt-32 pb-stack-lg bg-surface">
        {/* Page Header */}
        <header className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-md text-center">
          <span className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em] mb-4 block">
            CURATED EXCELLENCE
          </span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface leading-tight mb-6">
            Mastering the Art of <br />Modern Grooming
          </h1>
          <p className="max-w-2xl mx-auto text-on-surface-variant font-body-lg">
            Explore a selection of transformative styles, precision cuts, and master artistry from the studio of Rahul S Tipukade.
          </p>
        </header>

        {/* Portfolio Masonry Grid */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-gutter">

            {galleryItems.map((item) => {
              if (item.category === "transformations") {
                const beforeImg = item.id === "trans-1"
                  ? (sectionImages.portfolio_before || item.before)
                  : item.before;
                const afterImg = item.id === "trans-1"
                  ? (sectionImages.portfolio_after || item.after)
                  : item.after;

                return (
                  <div key={item.id} className="break-inside-avoid mb-gutter glass-card p-4 rounded-xl">
                    <span className="font-label-caps text-[10px] text-on-surface-variant mb-2 block">TRANSFORMATION</span>
                    {beforeImg && afterImg && (
                      <BeforeAfterSlider
                        before={imagesLoaded ? beforeImg : SPACER_GIF}
                        after={imagesLoaded ? afterImg : SPACER_GIF}
                        aspect="aspect-square"
                      />
                    )}
                    <div className="mt-4">
                      <h3 className="font-headline-sm text-lg text-on-surface">{item.title}</h3>
                      {item.description && <p className="text-on-surface-variant text-sm mt-1">{item.description}</p>}
                    </div>
                  </div>
                );
              }

              if (item.category === "reels") {
                const { type } = getEmbedUrl(item.videoUrl || "");
                const isDirectVideo = item.videoUrl && type === "video";

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.videoUrl && imagesLoaded) setActiveVideo(item.videoUrl);
                    }}
                    className="break-inside-avoid mb-gutter relative group overflow-hidden rounded-xl bg-surface-container-highest cursor-pointer transition-all shadow-sm hover:shadow-md border border-outline-variant/20"
                  >
                    <div className="aspect-[9/16] relative flex items-center justify-center">
                      {isDirectVideo ? (
                        <video
                          className="absolute inset-0 w-full h-full object-cover"
                          src={imagesLoaded ? item.videoUrl : undefined}
                          poster={imagesLoaded ? item.image : SPACER_GIF}
                          autoPlay={imagesLoaded}
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          className="absolute inset-0 w-full h-full object-cover opacity-80"
                          alt={item.title}
                          src={imagesLoaded ? item.image : SPACER_GIF}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-xl p-4 rounded-full border border-white/30 transform scale-90 group-hover:scale-100 transition-transform flex items-center justify-center w-12 h-12 shadow-lg z-10">
                          <Play className="text-white fill-white" size={16} />
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 z-10 text-left">
                        <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-sm font-bold tracking-widest mb-2 block w-max">
                          {item.categoryLabel || "REEL"}
                        </span>
                        <h4 className="text-white font-headline-sm text-lg">{item.title}</h4>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (imagesLoaded) setSelectedItem(item);
                  }}
                  className="break-inside-avoid mb-gutter group cursor-pointer overflow-hidden rounded-xl bg-surface-container-low shadow-sm transition-all hover:shadow-md border border-outline-variant/20"
                >
                  <div className={`relative overflow-hidden ${item.aspect === "tall" ? "aspect-[3/4]" : "aspect-square"}`}>
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      alt={item.title}
                      src={imagesLoaded ? item.image : SPACER_GIF}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white font-headline-sm text-lg">{item.title}</span>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </section>

        {/* Instagram Integration */}
        <section className="bg-surface-container-low py-stack-lg border-t border-outline-variant/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em] mb-4 block">
                  LIVE FROM STUDIO
                </span>
                <h2 className="font-display-lg text-headline-md md:text-headline-md text-on-surface">
                  Follow the Journey @RahulStylist
                </h2>
              </div>
              <a
                className="flex items-center gap-2 group border-b border-primary pb-2 font-button-text text-primary"
                href="https://www.instagram.com/1_hair_artist_"
                target="_blank"
                rel="noopener noreferrer"
              >
                VISIT INSTAGRAM
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(dbInstagramPosts.length > 0 ? dbInstagramPosts : instagramPosts).map((post, idx) => (
                <div
                  key={idx}
                  className={`aspect-square bg-surface-container overflow-hidden rounded-lg group cursor-pointer relative shadow-sm hover:shadow-md border border-outline-variant/10 ${idx >= 4 ? "hidden md:block" : ""
                    }`}
                >
                  <img
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    alt={`Instagram post ${idx + 1}`}
                    src={post}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-instagram"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-stack-lg text-center">
          <GlassCard className="py-20 px-8 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10"></div>
            <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mb-6">
              Experience the Transformation
            </h2>
            <p className="text-on-surface-variant font-body-lg mb-10 max-w-xl mx-auto">
              Book your session with Rahul S Tipukade and define your unique aesthetic with expert precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <button className="bg-inverse-surface text-surface px-10 py-4 rounded-full font-button-text hover:shadow-lg transition-all active:scale-95">
                  Book Your Appointment
                </button>
              </Link>
              <Link href="/services">
                <button className="bg-white border border-outline-variant/50 text-on-surface px-10 py-4 rounded-full font-button-text hover:bg-surface-container transition-all active:scale-95">
                  View All Services
                </button>
              </Link>
            </div>
          </GlassCard>
        </section>
      </main>

      <PremiumFooter />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-8 right-8 text-white hover:text-primary transition-colors focus:outline-none"
            >
              <X size={36} />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-full max-h-[85vh] overflow-hidden rounded-lg shadow-2xl flex flex-col items-center"
            >
              <img
                alt={selectedItem.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
                src={selectedItem.image}
              />
              <div className="text-center mt-6 text-white max-w-lg px-4">
                <span className="font-label-caps text-[10px] text-primary tracking-widest block mb-2">{selectedItem.categoryLabel}</span>
                <h3 className="font-headline-sm text-2xl">{selectedItem.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Reel Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4"
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-8 right-8 text-white hover:text-primary transition-colors focus:outline-none"
            >
              <X size={36} />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-4xl aspect-video overflow-hidden rounded-xl shadow-2xl bg-black"
            >
              {(() => {
                const { type, embedUrl } = getEmbedUrl(activeVideo);
                if (type === "iframe") {
                  return (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                }
                return (
                  <video
                    src={activeVideo}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Before & After Interactive Slider Sub-component
interface BeforeAfterSliderProps {
  before: string;
  after: string;
  aspect?: string;
}

function BeforeAfterSlider({ before, after, aspect = "aspect-[4/3]" }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) { // Left click held down and dragged
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative ${aspect} w-full rounded-xl overflow-hidden glass-card group select-none cursor-ew-resize border border-outline-variant/30`}
    >
      {/* Before Image */}
      <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" />

      {/* After Image (Clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Slider Divider Bar */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white z-10 shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg border border-white/50 hover:scale-105 active:scale-95 transition-transform">
          <Sparkles size={16} />
        </div>
      </div>

      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-on-surface">AFTER</div>
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white">BEFORE</div>
    </div>
  );
}
