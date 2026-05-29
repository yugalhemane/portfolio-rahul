"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Calendar, BookOpen, Settings, LogOut, Check, X, Clock, 
  Edit2, Trash2, Plus, AlertCircle, RefreshCw, ChevronRight, Phone, Mail, 
  FileText, CheckCircle2, Star, Image as ImageIcon, Video, MessageSquare, Award, Play
} from "lucide-react";
import LuxuryNavbar from "@/components/common/LuxuryNavbar";
import PremiumFooter from "@/components/common/PremiumFooter";
import GlassCard from "@/components/common/GlassCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  status: "Pending" | "Confirmed";
  createdAt: string;
}

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  course: string;
  message?: string;
  createdAt: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  price: string;
  category?: string;
  icon?: string;
  image?: string;
}

interface GalleryItem {
  _id: string;
  title: string;
  category: "cuts" | "colors" | "styling" | "bridal" | "grooming" | "studio" | "transformations" | "reels" | "instagram";
  imageUrl?: string;
  videoUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  description?: string;
  featured?: boolean;
  createdAt: string;
}

interface Testimonial {
  _id: string;
  clientName: string;
  image?: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Masterclass";
  syllabus: string[];
  image?: string;
  createdAt: string;
}

interface SectionImage {
  _id?: string;
  key: string;
  imageUrl: string;
  pageName: string;
  sectionName: string;
}

const EDITABLE_SECTIONS = [
  { key: "home_hero", pageName: "Home", sectionName: "Hero Main Portrait", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6vhu1RljoqONcemxzHQ5DafcDCRnqt-kLsYub0wxabYh1DxCacSA9FTcAujFEVIxIN4D0d8JSjGdKZNWZfQU6aho-2mHvk6JBYam1n9zhKsaIEbhKh-Ryv4vmVrVGrmjdpQ_FUnZIn_V3LdenESaEsEnh3YrUop3KzfhQD4ECCSRY3rzJsc65ncvoe-nUcX8XLN11PwStm1yBTqnxG03OBPLh_jYN_pV49VULmYRgbic9EGSaOdPduDu93zwNOcpB1DpXFVxJn2E" },
  { key: "home_why_1", pageName: "Home", sectionName: "Why Choose 1 (Grooming Tools)", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDD_rILHePl8FoF88G9zCyMu1FyjGqPaeT0y4uAMARiuWnZ7mKzsYkVkY2SKCMywnaAsEqM8qTAzvyB1JCzA4UOlCOyks6bAC7s1dP797VZikUQbOd4lGfiPtCt66NmhyNyMc3BFZ6TygQ9ivwK4nbgaa8kTzUYaaKaE7M9EkWznDuZpIRGKk1ufTKxoJ-bF2KkIzJu6wMe1dNNCNqzynyaHethG68Kn47OAjLnVHYArHvn5XBVzyFdy7D5yzT1LBqvEm7ItYGO2dg" },
  { key: "home_why_2", pageName: "Home", sectionName: "Why Choose 2 (Atelier Interior)", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWD3IxtQ5RUEj-iE0CtYw73yKSEJvXcy-osovttPz_0Mlh06YL70c2jvdSn-FKnrWaZLK9IzakZwgblCfGvZGRyxccJR9NRL5YVEZIHIXfdHdtWp3pwQLc_gHqDzcOLz1PxgnTxk0UlmVS-v6QFGEEwo8ljtqYy8WmQebtkTZWANeHv-DHc2prVZdk6Scn3ECHKARnN8QO2Dm7EDs97UINP_yUUOr9Yw6G820ktw36gfQ0Dan0Za3_JbecT6RVvsrOT1-dl5WIlB0" },
  { key: "home_why_3", pageName: "Home", sectionName: "Why Choose 3 (Stylist Working)", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdWVWEAYui1EGP_Bq5EUXdMBENU9HvGjHWGs8bQ13rpNom2dWvMdoxWyMxV3yRtTXLsz5xSSZBMF6iFL1g2N2Fc2eAkboxNXY-pWrGpoDRMY9_x9rwcMdJ01Vb7qUQAXZycVXOGn4Ox0TJsttszshezZVlBujShuuIPXsqXy-jrA-X4Vm1YPwsHUu3LLDnte91kdSvQ_-pQbv3f7QGhkZ3Qz776lTPniIfndhfQO6w_cVy04z4Yt_RvI_rVc7gCkntFYVWyAReHIY" },
  { key: "home_why_4", pageName: "Home", sectionName: "Why Choose 4 (Finished Hairstyle)", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCP1ysfvEOccryySAJkbYXMMqTl_zhOxrVKGjIU6gu6UoJp_Bb2a--Jbpzk290uEk0K3m406j-lSQTLZ2EBuxL39P2TH9K2ju1ta8yZIO0axo0Cb2t-FU8aM97kKxc1GMJhhfd547N6eP0WlXp_Hlj-LKWZuUvXbrgNcZMzO6ZE0Avj-RbZ-3nt0e7RmgIChMEm9OSiC5aj1mHdGT5Pd2f5f6Z3f43qJAA8T2Sqfxb_XkewjuKPc1GGrR9Vvu2mXEhX2ABnFW3wYaU" },
  { key: "services_hero", pageName: "Services", sectionName: "Hero Atelier Interior", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFOtXhlspiofLCUHcklCu9LbG874-VizlOiMWMP7KvIKbg7zB8HNu-lNzqnB1io-JyqK1xMp4DZ9G9wyYJs8rgXX11TJ7wO-_Yg-8hs_IV_CEUId66dvDY9dsnmnMEKtZGU9s6p4zIwYeSF1crug0f0f6pTcwexuOPpEl3XVwHtUmHYWF5yGdSUx2mFmQwQALjxv5w_MtpMBuqUqjrdlfcJpo2m_2R2TjPaEA2bMiovr8porjedVGA-6aUJbawo8RJojwnT9pjQ_s" },
  { key: "services_process_1", pageName: "Services", sectionName: "Process 1 (Precision Styling)", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ewkVjKcaei3A5dApx6Id5PKlhUZL9Sfx-8k8hQjD518YP1IGvCKVgU1Xiix5Cp9zLPvHJOn6AX_V7BsuhnhDYwNS_-64DXO-P4FaaSQEYHAvwMiohdkVdaLbYBVUD4DGkioBelJXJ4ctNDfzl-2qDPEu-7mLZrQrKOVuhSzOVO-P9VOthrtbrksuMgBlykrt_5ZfMUcd9Au5klc0GQdv_BWN3auHVIYn-OHynTFHakWE1VkvYcv-KCdUrwjWbS1AWx5eNtKmnqk" },
  { key: "services_process_2", pageName: "Services", sectionName: "Process 2 (Premium Tools)", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvlnYURueXIbIlScp5wjXBlBFjw8Y5eRHdmGYKpZ01EWJzxxE9kHnNaiT9Wz02SKKWOajupO-a1BpUT0SaLi2b915nzh_ndtr_W_3S3qo0Qhraj_ISQ47OYJYjFmOY1iiNoOIIxha59qPiO_USz947VDm_bOCrpGKWXzdkjFsOslFcC9k01jIijvlooA-N06ePJ0-0Mjgwt2jgHr3w8qrSQypKSCCCPsYbtnvfs4TdA3B2Pug4n7uyO9S5sVcIh5FQBb56GZZ92TU" },
  { key: "services_consultation", pageName: "Services", sectionName: "Consultation Banner", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOeMw0Leqi1jNmuJsgaQ14CKS7haszjq2gohw-Gobh1k-jOdGv11R8WulW9k-hK9gGgaEiH3VUpgibBAocXRtetJkvME526BN3bvlM8SDFCLWtDvUOpMstdyX3AMaj1p8XFqP5CFG1PXerWS1Ro9oueJmUDZsWYyeNOww5o04Aea3G0orS4iHsH9VGkfVIafHRU_TNrWL1TwhsKYRU6xO_jCedlPmsPa4Ih_1oPzDzb9qwLFlzMq8TuWI5Cqq51ZaSOqxtFq9vKnY" },
  { key: "about_intro", pageName: "About", sectionName: "Hero Main Portrait", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXJcqyH6sSDWkiA6z6X5ytVYvnaOFLLvmlJeBRc1CY_6IWlDfDU-kbd-xHOqWdgpygz-0gtPPgf0h4vtpn9TNPe4oCLWuWDHdXTGXsvDe0xzEcswswp6vwY5NfyCujKgsK_PSgcD0bIXmfjAdt-2WFcx68lGcCexWKkznKSy4I_8T-VUe5KqszY3BVHiSegj1IjfDB5lE-eqpS9gM6-BNYUAunSeJnB_95ZWCXjnyNfu2_6HOXT-mtRYYymjDac_nPkGSS0Yo4tVo" },
  { key: "about_story", pageName: "About", sectionName: "Philosophy/Story Banner", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdWVWEAYui1EGP_Bq5EUXdMBENU9HvGjHWGs8bQ13rpNom2dWvMdoxWyMxV3yRtTXLsz5xSSZBMF6iFL1g2N2Fc2eAkboxNXY-pWrGpoDRMY9_x9rwcMdJ01Vb7qUQAXZycVXOGn4Ox0TJsttszshezZVlBujShuuIPXsqXy-jrA-X4Vm1YPwsHUu3LLDnte91kdSvQ_-pQbv3f7QGhkZ3Qz776lTPniIfndhfQO6w_cVy04z4Yt_RvI_rVc7gCkntFYVWyAReHIY" },
  { key: "booking_sidebar", pageName: "Booking", sectionName: "Sidebar Map Image", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKYJZkLZYX9YoYCLlpj2Ny7ZIuoO2CD8YOYk_HeK1yVJQUnunSk4_ZPj0csK7TF-pd_k4K8kj0NwJh4XVmMReLnhFZJO8rANJKX-uwgdzVSsOVy6E4vFQ9Tb298DGAbeDBvam5f0tCqoCY1sISIfzSDzYlh4NqnG739vlzqzCXzak88f3K6aYaC5niLxCSiqY-LBIobQCTZZ9kdjEBU4HEjgnYuDcDcBmhM7_Uoc0ykgz-jDu5hDIbuJucAROrOhdLSuhdeSm4TVQ" },
  { key: "portfolio_before", pageName: "Portfolio", sectionName: "Transformation (Before Image)", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwG9AioRBKZkcYzmOzRmW7aDgi6Ur3vOvj5X6A5BXi0qMXceWV5j9IXwaT_XuV2EAtGE7T140KxXMJN46isQx_pPUzloT4bu626U6AuiKd2E-9qkB39V4FnuUBL8BN8Z40tuEHfnKSXcstwqF2uVjnF4ENaBckfoFPatOtDboaLDPZ5qvYOXZU7KU--HbjzjwG-l1osvyS7uryajaw_KUaoRGVMc19YuyJ25wV_V7YHOBYwYKe8sTsyCO5ebtSeey6iAaxVaC5nPA" },
  { key: "portfolio_after", pageName: "Portfolio", sectionName: "Transformation (After Image)", fallbackUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBowznbSvls8WwbaA_i73BuePK3S8nJqtLMH1BCKWLfCC3X3ewbxxEgFMjZMM2qzem47Tgb1-5ovVkL3igbMJmjRal8oVDvKNKM4upY_2AMGWqeijtZlPJf8KTibCwKLPHNYwyMPYHntZig49fu3kjxQLpBEWJwDjmhDQ3L7GoNorsMu_PC31HS8R5F9nHrMC-79M4qW-S9YgmRxczSWb6OqN8FtsBf0qGjeVDUYqcMNltXePoCO29BxzZkpGlOw5s3rcbrWHIAAbk" }
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<"bookings" | "inquiries" | "services" | "gallery" | "testimonials" | "courses" | "pageImages">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sectionImages, setSectionImages] = useState<SectionImage[]>([]);
  const [uploadingSectionKey, setUploadingSectionKey] = useState<string | null>(null);
  
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Service Management forms
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({ title: "", description: "", price: "", category: "Haircuts", icon: "scissors" });
  const [serviceImageFile, setServiceImageFile] = useState<File | null>(null);

  // Gallery Management forms
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ 
    title: "", 
    category: "cuts" as GalleryItem["category"], 
    description: "", 
    featured: "false", 
    videoUrl: "" 
  });
  const [galleryFiles, setGalleryFiles] = useState<{
    file?: File;
    thumbnail?: File;
    beforeImage?: File;
    afterImage?: File;
  }>({});
  const [reelSource, setReelSource] = useState<"upload" | "url">("upload");

  // Testimonials forms
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ clientName: "", rating: "5", feedback: "" });
  const [testimonialFile, setTestimonialFile] = useState<File | null>(null);

  // Training Programs forms
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({ 
    title: "", 
    description: "", 
    duration: "", 
    price: "", 
    level: "Advanced" as Course["level"], 
    syllabusText: "" 
  });
  const [courseFile, setCourseFile] = useState<File | null>(null);

  useEffect(() => {
    // Check localStorage for token on load
    const storedToken = localStorage.getItem("admin_token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [bookingsRes, inquiriesRes, servicesRes, galleryRes, testimonialsRes, coursesRes, sectionImagesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/bookings`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/academy/inquiries`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/services`).catch(() => null),
        fetch(`${API_BASE_URL}/gallery`).catch(() => null),
        fetch(`${API_BASE_URL}/testimonials`).catch(() => null),
        fetch(`${API_BASE_URL}/academy/courses`).catch(() => null),
        fetch(`${API_BASE_URL}/section-images`).catch(() => null),
      ]);

      let bookingsData: Booking[] = [];
      let inquiriesData: Inquiry[] = [];
      let servicesData: Service[] = [];
      let galleryData: GalleryItem[] = [];
      let testimonialsData: Testimonial[] = [];
      let coursesData: Course[] = [];
      let sectionImagesData: SectionImage[] = [];

      if (bookingsRes && bookingsRes.ok) bookingsData = await bookingsRes.json();
      else throw new Error("Backend offline");

      if (inquiriesRes && inquiriesRes.ok) inquiriesData = await inquiriesRes.json();
      if (servicesRes && servicesRes.ok) servicesData = await servicesRes.json();
      if (galleryRes && galleryRes.ok) galleryData = await galleryRes.json();
      if (testimonialsRes && testimonialsRes.ok) testimonialsData = await testimonialsRes.json();
      if (coursesRes && coursesRes.ok) coursesData = await coursesRes.json();
      if (sectionImagesRes && sectionImagesRes.ok) sectionImagesData = await sectionImagesRes.json();

      setBookings(bookingsData);
      setInquiries(inquiriesData);
      setServices(servicesData);
      setGalleryItems(galleryData);
      setTestimonials(testimonialsData);
      setCourses(coursesData);
      setSectionImages(sectionImagesData);
      setIsDemoMode(false);
    } catch (err) {
      console.log("Failed to connect to backend, falling back to mock demo data:", err);
      setIsDemoMode(true);
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockData = () => {
    setBookings([
      {
        _id: "mock-1",
        name: "Siddharth Malhotra",
        email: "sid.m@example.com",
        phone: "+91 98765 43210",
        service: "Signature Haircut & Beard Sculpt",
        date: "2026-05-28",
        time: "11:00 AM",
        notes: "Prefers high-end styling spray, scalp massage.",
        status: "Pending",
        createdAt: new Date().toISOString()
      },
      {
        _id: "mock-2",
        name: "Pooja Hegde",
        email: "pooja@example.com",
        phone: "+91 99887 76655",
        service: "Luxury Hair Coloring & Therapy",
        date: "2026-05-29",
        time: "02:30 PM",
        notes: "Needs botanical moisture treatment.",
        status: "Confirmed",
        createdAt: new Date().toISOString()
      }
    ]);

    setInquiries([
      {
        _id: "inq-1",
        name: "Aditya Roy Kapur",
        email: "aditya@academy.com",
        course: "Advanced Scissor Mechanics & Sculpting",
        message: "I have 2 years of styling experience. Want to specialize in precision hair dressing.",
        createdAt: new Date().toISOString()
      }
    ]);

    setServices([
      { _id: "s1", title: "Precision Haircut", price: "$45", description: "Bespoke styling tailored to facial structure.", icon: "scissors" },
      { _id: "s2", title: "Luxury Beard Grooming", price: "$35", description: "Straight-razor detailing with hot towel oil massage.", icon: "smile" }
    ]);

    setGalleryItems([
      {
        _id: "gal-1",
        title: "Signature precision Cut",
        category: "cuts",
        imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500",
        description: "Editorial standard cut",
        featured: true,
        createdAt: new Date().toISOString()
      }
    ]);

    setTestimonials([
      {
        _id: "test-1",
        clientName: "Ananya Sharma",
        feedback: "Rahul's expertise is evident from the first cut. His 20 years of experience translates into a level of confidence and precision I haven't found elsewhere.",
        rating: 5,
        createdAt: new Date().toISOString()
      }
    ]);

    setCourses([
      {
        _id: "course-1",
        title: "Foundation Hair Styling & Barbering",
        description: "A comprehensive course designed for aspiring stylists. Master scissors cutting and salon operations.",
        duration: "3 Months (Full-Time)",
        price: "$1,200",
        level: "Beginner",
        syllabus: ["Introduction to hair science", "Core scissors cutting angles", "Traditional barbering"],
        createdAt: new Date().toISOString()
      }
    ]);
    setSectionImages([]);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError("Please enter both credentials.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("admin_token", data.token);
        setToken(data.token);
        setIsAuthenticated(true);
      } else {
        setLoginError(data.message || "Invalid username or password.");
      }
    } catch (err) {
      console.log("Login network error, simulating offline login for development:", err);
      if (username === "admin" && password === "rahulpas123") {
        const mockToken = "mock_jwt_token_for_rahul";
        localStorage.setItem("admin_token", mockToken);
        setToken(mockToken);
        setIsAuthenticated(true);
      } else {
        setLoginError("Login failed. Check server connection or use admin/rahulpas123.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
    setIsAuthenticated(false);
  };

  // ==================== APPOINTMENT BOOKINGS CRUD ====================
  const handleUpdateBookingStatus = async (id: string, newStatus: "Confirmed" | "Pending") => {
    if (isDemoMode) {
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
      } else {
        alert("Failed to update status on server.");
      }
    } catch (err) {
      console.error(err);
      alert("Error reaching backend.");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    if (isDemoMode) {
      setBookings(prev => prev.filter(b => b._id !== id));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setBookings(prev => prev.filter(b => b._id !== id));
      } else {
        alert("Failed to delete booking.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==================== ENQUIRIES CRUD ====================
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to remove this academy inquiry?")) return;

    if (isDemoMode) {
      setInquiries(prev => prev.filter(inq => inq._id !== id));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/academy/inquiries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setInquiries(prev => prev.filter(inq => inq._id !== id));
      } else {
        alert("Failed to delete inquiry.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==================== SERVICES CRUD ====================
  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.price) {
      alert("Title and Price are required.");
      return;
    }

    if (isDemoMode) {
      const mockNew: Service = {
        _id: `service-${Date.now()}`,
        ...serviceForm,
        image: serviceImageFile ? URL.createObjectURL(serviceImageFile) : undefined
      };
      setServices(prev => [...prev, mockNew]);
      setShowAddService(false);
      setServiceForm({ title: "", description: "", price: "", category: "Haircuts", icon: "scissors" });
      setServiceImageFile(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", serviceForm.title);
      formData.append("description", serviceForm.description);
      formData.append("price", serviceForm.price);
      formData.append("category", serviceForm.category);
      formData.append("icon", serviceForm.icon);
      if (serviceImageFile) {
        formData.append("image", serviceImageFile);
      }

      const res = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const added = await res.json();
        setServices(prev => [...prev, added]);
        setShowAddService(false);
        setServiceForm({ title: "", description: "", price: "", category: "Haircuts", icon: "scissors" });
        setServiceImageFile(null);
      } else {
        alert("Failed to save service to server.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    if (isDemoMode) {
      setServices(prev => prev.map(s => s._id === editingService._id ? {
        ...s,
        ...serviceForm,
        image: serviceImageFile ? URL.createObjectURL(serviceImageFile) : s.image
      } : s));
      setEditingService(null);
      setServiceImageFile(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", serviceForm.title);
      formData.append("description", serviceForm.description);
      formData.append("price", serviceForm.price);
      formData.append("category", serviceForm.category);
      formData.append("icon", serviceForm.icon);
      if (serviceImageFile) {
        formData.append("image", serviceImageFile);
      }

      const res = await fetch(`${API_BASE_URL}/services/${editingService._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const updated = await res.json();
        setServices(prev => prev.map(s => s._id === updated._id ? updated : s));
        setEditingService(null);
        setServiceImageFile(null);
      } else {
        alert("Failed to update service on server.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    if (isDemoMode) {
      setServices(prev => prev.filter(s => s._id !== id));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setServices(prev => prev.filter(s => s._id !== id));
      } else {
        alert("Failed to delete service.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==================== GALLERY CRUD ====================
  const handleAddGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title) {
      alert("Title is required.");
      return;
    }

    if (isDemoMode) {
      const mockNew: GalleryItem = {
        _id: `gal-${Date.now()}`,
        title: galleryForm.title,
        category: galleryForm.category,
        description: galleryForm.description,
        featured: galleryForm.featured === "true",
        imageUrl: galleryFiles.thumbnail ? URL.createObjectURL(galleryFiles.thumbnail) : (galleryFiles.file && !galleryFiles.file.type.startsWith("video/") ? URL.createObjectURL(galleryFiles.file) : "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500"),
        beforeImageUrl: galleryFiles.beforeImage ? URL.createObjectURL(galleryFiles.beforeImage) : undefined,
        afterImageUrl: galleryFiles.afterImage ? URL.createObjectURL(galleryFiles.afterImage) : undefined,
        videoUrl: galleryForm.videoUrl || (galleryFiles.file && galleryFiles.file.type.startsWith("video/") ? URL.createObjectURL(galleryFiles.file) : undefined),
        createdAt: new Date().toISOString()
      };
      setGalleryItems(prev => [mockNew, ...prev]);
      setShowAddGallery(false);
      setGalleryForm({ title: "", category: "cuts", description: "", featured: "false", videoUrl: "" });
      setGalleryFiles({});
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", galleryForm.title);
      formData.append("category", galleryForm.category);
      formData.append("description", galleryForm.description);
      formData.append("featured", galleryForm.featured);
      
      if (galleryForm.videoUrl) {
        formData.append("videoUrl", galleryForm.videoUrl);
      }

      if (galleryFiles.file) {
        formData.append("file", galleryFiles.file);
      }
      if (galleryFiles.thumbnail) {
        formData.append("thumbnail", galleryFiles.thumbnail);
      }
      if (galleryFiles.beforeImage) {
        formData.append("beforeImage", galleryFiles.beforeImage);
      }
      if (galleryFiles.afterImage) {
        formData.append("afterImage", galleryFiles.afterImage);
      }

      const res = await fetch(`${API_BASE_URL}/gallery`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const added = await res.json();
        setGalleryItems(prev => [added, ...prev]);
        setShowAddGallery(false);
        setGalleryForm({ title: "", category: "cuts", description: "", featured: "false", videoUrl: "" });
        setGalleryFiles({});
      } else {
        alert("Failed to save media upload to server.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;

    if (isDemoMode) {
      setGalleryItems(prev => prev.map(g => g._id === editingGallery._id ? {
        ...g,
        title: galleryForm.title,
        category: galleryForm.category,
        description: galleryForm.description,
        featured: galleryForm.featured === "true",
        imageUrl: galleryFiles.thumbnail ? URL.createObjectURL(galleryFiles.thumbnail) : (galleryFiles.file && !galleryFiles.file.type.startsWith("video/") ? URL.createObjectURL(galleryFiles.file) : g.imageUrl),
        beforeImageUrl: galleryFiles.beforeImage ? URL.createObjectURL(galleryFiles.beforeImage) : g.beforeImageUrl,
        afterImageUrl: galleryFiles.afterImage ? URL.createObjectURL(galleryFiles.afterImage) : g.afterImageUrl,
        videoUrl: galleryForm.videoUrl || (galleryFiles.file && galleryFiles.file.type.startsWith("video/") ? URL.createObjectURL(galleryFiles.file) : g.videoUrl)
      } : g));
      setEditingGallery(null);
      setGalleryFiles({});
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", galleryForm.title);
      formData.append("category", galleryForm.category);
      formData.append("description", galleryForm.description);
      formData.append("featured", galleryForm.featured);
      
      if (galleryForm.videoUrl !== undefined) {
        formData.append("videoUrl", galleryForm.videoUrl);
      }

      if (galleryFiles.file) {
        formData.append("file", galleryFiles.file);
      }
      if (galleryFiles.thumbnail) {
        formData.append("thumbnail", galleryFiles.thumbnail);
      }
      if (galleryFiles.beforeImage) {
        formData.append("beforeImage", galleryFiles.beforeImage);
      }
      if (galleryFiles.afterImage) {
        formData.append("afterImage", galleryFiles.afterImage);
      }

      const res = await fetch(`${API_BASE_URL}/gallery/${editingGallery._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const updated = await res.json();
        setGalleryItems(prev => prev.map(g => g._id === updated._id ? updated : g));
        setEditingGallery(null);
        setGalleryFiles({});
      } else {
        alert("Failed to update media item on server.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    if (isDemoMode) {
      setGalleryItems(prev => prev.filter(g => g._id !== id));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setGalleryItems(prev => prev.filter(g => g._id !== id));
      } else {
        alert("Failed to delete media item.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==================== TESTIMONIALS CRUD ====================
  const handleAddTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.clientName || !testimonialForm.feedback) {
      alert("Client Name and Feedback are required.");
      return;
    }

    if (isDemoMode) {
      const mockNew: Testimonial = {
        _id: `test-${Date.now()}`,
        clientName: testimonialForm.clientName,
        rating: parseInt(testimonialForm.rating, 10),
        feedback: testimonialForm.feedback,
        image: testimonialFile ? URL.createObjectURL(testimonialFile) : undefined,
        createdAt: new Date().toISOString()
      };
      setTestimonials(prev => [mockNew, ...prev]);
      setShowAddTestimonial(false);
      setTestimonialForm({ clientName: "", rating: "5", feedback: "" });
      setTestimonialFile(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("clientName", testimonialForm.clientName);
      formData.append("feedback", testimonialForm.feedback);
      formData.append("rating", testimonialForm.rating);
      if (testimonialFile) {
        formData.append("image", testimonialFile);
      }

      const res = await fetch(`${API_BASE_URL}/testimonials`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const added = await res.json();
        setTestimonials(prev => [added, ...prev]);
        setShowAddTestimonial(false);
        setTestimonialForm({ clientName: "", rating: "5", feedback: "" });
        setTestimonialFile(null);
      } else {
        alert("Failed to save testimonial.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    if (isDemoMode) {
      setTestimonials(prev => prev.map(t => t._id === editingTestimonial._id ? {
        ...t,
        clientName: testimonialForm.clientName,
        rating: parseInt(testimonialForm.rating, 10),
        feedback: testimonialForm.feedback,
        image: testimonialFile ? URL.createObjectURL(testimonialFile) : t.image
      } : t));
      setEditingTestimonial(null);
      setTestimonialFile(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("clientName", testimonialForm.clientName);
      formData.append("feedback", testimonialForm.feedback);
      formData.append("rating", testimonialForm.rating);
      if (testimonialFile) {
        formData.append("image", testimonialFile);
      }

      const res = await fetch(`${API_BASE_URL}/testimonials/${editingTestimonial._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const updated = await res.json();
        setTestimonials(prev => prev.map(t => t._id === updated._id ? updated : t));
        setEditingTestimonial(null);
        setTestimonialFile(null);
      } else {
        alert("Failed to update testimonial.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    if (isDemoMode) {
      setTestimonials(prev => prev.filter(t => t._id !== id));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setTestimonials(prev => prev.filter(t => t._id !== id));
      } else {
        alert("Failed to delete testimonial.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==================== TRAINING COURSES CRUD ====================
  const handleAddCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.price || !courseForm.duration) {
      alert("Title, Price and Duration are required.");
      return;
    }

    const syllabusArray = courseForm.syllabusText
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    if (isDemoMode) {
      const mockNew: Course = {
        _id: `course-${Date.now()}`,
        title: courseForm.title,
        description: courseForm.description,
        duration: courseForm.duration,
        price: courseForm.price,
        level: courseForm.level,
        syllabus: syllabusArray,
        image: courseFile ? URL.createObjectURL(courseFile) : undefined,
        createdAt: new Date().toISOString()
      };
      setCourses(prev => [mockNew, ...prev]);
      setShowAddCourse(false);
      setCourseForm({ title: "", description: "", duration: "", price: "", level: "Advanced", syllabusText: "" });
      setCourseFile(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", courseForm.title);
      formData.append("description", courseForm.description);
      formData.append("duration", courseForm.duration);
      formData.append("price", courseForm.price);
      formData.append("level", courseForm.level);
      formData.append("syllabus", JSON.stringify(syllabusArray));
      if (courseFile) {
        formData.append("image", courseFile);
      }

      const res = await fetch(`${API_BASE_URL}/academy/courses`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        const added = await res.json();
        setCourses(prev => [added, ...prev]);
        setShowAddCourse(false);
        setCourseForm({ title: "", description: "", duration: "", price: "", level: "Advanced", syllabusText: "" });
        setCourseFile(null);
      } else {
        alert("Failed to save course.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    const syllabusArray = courseForm.syllabusText
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    if (isDemoMode) {
      setCourses(prev => prev.map(c => c._id === editingCourse._id ? {
        ...c,
        title: courseForm.title,
        description: courseForm.description,
        duration: courseForm.duration,
        price: courseForm.price,
        level: courseForm.level,
        syllabus: syllabusArray,
        image: courseFile ? URL.createObjectURL(courseFile) : c.image
      } : c));
      setEditingCourse(null);
      setCourseFile(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", courseForm.title);
      formData.append("description", courseForm.description);
      formData.append("duration", courseForm.duration);
      formData.append("price", courseForm.price);
      formData.append("level", courseForm.level);
      formData.append("syllabus", JSON.stringify(syllabusArray));
      if (courseFile) {
        formData.append("image", courseFile);
      }

      const res = await fetch(`${API_BASE_URL}/academy/courses/${editingCourse._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        const updated = await res.json();
        setCourses(prev => prev.map(c => c._id === updated._id ? updated : c));
        setEditingCourse(null);
        setCourseFile(null);
      } else {
        alert("Failed to update course.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    if (isDemoMode) {
      setCourses(prev => prev.filter(c => c._id !== id));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/academy/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setCourses(prev => prev.filter(c => c._id !== id));
      } else {
        alert("Failed to delete course.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSectionImageUpload = async (key: string, file: File, pageName: string, sectionName: string) => {
    if (isDemoMode) {
      const objectUrl = URL.createObjectURL(file);
      setSectionImages(prev => {
        const existingIdx = prev.findIndex(item => item.key === key);
        const newItem = { key, imageUrl: objectUrl, pageName, sectionName };
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = newItem;
          return updated;
        } else {
          return [...prev, newItem];
        }
      });
      alert(`[Demo Mode] Successfully uploaded custom image for section: ${sectionName}`);
      return;
    }

    setUploadingSectionKey(key);
    try {
      const formData = new FormData();
      formData.append("key", key);
      formData.append("pageName", pageName);
      formData.append("sectionName", sectionName);
      formData.append("image", file);

      const res = await fetch(`${API_BASE_URL}/section-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setSectionImages(prev => {
          const existingIdx = prev.findIndex(item => item.key === key);
          if (existingIdx !== -1) {
            const updated = [...prev];
            updated[existingIdx] = data;
            return updated;
          } else {
            return [...prev, data];
          }
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Failed to upload section image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error connecting to backend.");
    } finally {
      setUploadingSectionKey(null);
    }
  };

  return (
    <>
      <LuxuryNavbar />

      <main className="pt-32 pb-stack-lg bg-surface min-h-screen">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          
          {!isAuthenticated ? (
            /* Luxury Login UI */
            <div className="max-w-md mx-auto py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="p-8 rounded-2xl shadow-xl bg-white/70 border border-outline-variant/30">
                  <div className="text-center mb-8">
                    <span className="font-label-caps text-label-caps text-primary tracking-[0.25em] block mb-2">PORTFOLIO CONTROL</span>
                    <h2 className="font-display-lg text-headline-md text-on-surface">Admin Atelier Portal</h2>
                    <p className="font-body-md text-xs text-on-surface-variant mt-2">
                      Access the dashboard using your secure credentials.
                    </p>
                  </div>

                  {loginError && (
                    <div className="p-4 bg-error-container/10 border border-error/20 text-error rounded-lg flex items-center gap-3 text-xs mb-6 font-body-md">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder=" "
                        required
                        className="peer block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary transition-colors font-body-md text-on-surface outline-none"
                      />
                      <label className="absolute left-0 top-3 text-outline transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-xs peer-focus:text-primary peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:font-semibold">
                        Username
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder=" "
                        required
                        className="peer block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary transition-colors font-body-md text-on-surface outline-none"
                      />
                      <label className="absolute left-0 top-3 text-outline transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-xs peer-focus:text-primary peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:font-semibold">
                        Password
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full bg-primary text-on-primary py-4 rounded-full font-button-text uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {isLoggingIn ? "Authenticating..." : "ENTER PORTFOLIO SYSTEM"}
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
                    <p className="font-body-md text-[10px] text-outline leading-relaxed">
                      Developer Bypass Hint: Use username <code className="bg-surface-container px-1 py-0.5 rounded">admin</code> and password <code className="bg-surface-container px-1 py-0.5 rounded">rahulpas123</code>.
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          ) : (
            /* Luxury Admin Layout */
            <div className="space-y-8">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/30 pb-6">
                <div>
                  <span className="font-label-caps text-xs text-primary tracking-widest uppercase block mb-1">
                    RAHUL S TIPUKADE ATELIER
                  </span>
                  <h1 className="font-display-lg text-headline-md text-on-surface">Management Dashboard</h1>
                  
                  {isDemoMode && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mt-2 font-body-md">
                      <AlertCircle size={12} />
                      Running in Offline Demo Mode
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={fetchDashboardData}
                    className="p-3 bg-surface-container border border-outline-variant/30 text-on-surface rounded-full hover:bg-surface-container-high active:scale-95 transition-all"
                    title="Refresh data"
                  >
                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-3 bg-error text-on-error rounded-full font-label-caps text-xs tracking-wider active:scale-95 transition-all shadow-sm font-semibold"
                  >
                    <LogOut size={14} />
                    LOGOUT
                  </button>
                </div>
              </div>

              {/* Stats Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <GlassCard className="p-4 rounded-xl text-center" tiltEnabled={false}>
                  <div className="font-display-lg text-2xl text-primary mb-1">{bookings.length}</div>
                  <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">Bookings</div>
                </GlassCard>
                <GlassCard className="p-4 rounded-xl text-center" tiltEnabled={false}>
                  <div className="font-display-lg text-2xl text-amber-600 mb-1">
                    {bookings.filter(b => b.status === "Pending").length}
                  </div>
                  <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">Pending</div>
                </GlassCard>
                <GlassCard className="p-4 rounded-xl text-center" tiltEnabled={false}>
                  <div className="font-display-lg text-2xl text-primary mb-1">{galleryItems.length}</div>
                  <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">Gallery Items</div>
                </GlassCard>
                <GlassCard className="p-4 rounded-xl text-center" tiltEnabled={false}>
                  <div className="font-display-lg text-2xl text-primary mb-1">{testimonials.length}</div>
                  <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">Reviews</div>
                </GlassCard>
                <GlassCard className="p-4 rounded-xl text-center" tiltEnabled={false}>
                  <div className="font-display-lg text-2xl text-primary mb-1">{inquiries.length}</div>
                  <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">Academy Inq.</div>
                </GlassCard>
              </div>

              {/* Tabs list */}
              <div className="flex flex-wrap gap-2 border-b border-outline-variant/30">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`flex items-center gap-2 px-5 py-4 font-label-caps text-xs tracking-wider border-b-2 font-bold transition-all ${
                    activeTab === "bookings" ? "border-primary text-primary" : "border-transparent text-outline hover:text-on-surface"
                  }`}
                >
                  <Calendar size={14} />
                  BOOKINGS ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab("inquiries")}
                  className={`flex items-center gap-2 px-5 py-4 font-label-caps text-xs tracking-wider border-b-2 font-bold transition-all ${
                    activeTab === "inquiries" ? "border-primary text-primary" : "border-transparent text-outline hover:text-on-surface"
                  }`}
                >
                  <BookOpen size={14} />
                  ACADEMY INQUIRIES ({inquiries.length})
                </button>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`flex items-center gap-2 px-5 py-4 font-label-caps text-xs tracking-wider border-b-2 font-bold transition-all ${
                    activeTab === "services" ? "border-primary text-primary" : "border-transparent text-outline hover:text-on-surface"
                  }`}
                >
                  <Settings size={14} />
                  SERVICES
                </button>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`flex items-center gap-2 px-5 py-4 font-label-caps text-xs tracking-wider border-b-2 font-bold transition-all ${
                    activeTab === "gallery" ? "border-primary text-primary" : "border-transparent text-outline hover:text-on-surface"
                  }`}
                >
                  <ImageIcon size={14} />
                  GALLERY &amp; REELS
                </button>
                <button
                  onClick={() => setActiveTab("testimonials")}
                  className={`flex items-center gap-2 px-5 py-4 font-label-caps text-xs tracking-wider border-b-2 font-bold transition-all ${
                    activeTab === "testimonials" ? "border-primary text-primary" : "border-transparent text-outline hover:text-on-surface"
                  }`}
                >
                  <MessageSquare size={14} />
                  TESTIMONIALS
                </button>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`flex items-center gap-2 px-5 py-4 font-label-caps text-xs tracking-wider border-b-2 font-bold transition-all ${
                    activeTab === "courses" ? "border-primary text-primary" : "border-transparent text-outline hover:text-on-surface"
                  }`}
                >
                  <Award size={14} />
                  ACADEMY COURSES
                </button>
                <button
                  onClick={() => setActiveTab("pageImages")}
                  className={`flex items-center gap-2 px-5 py-4 font-label-caps text-xs tracking-wider border-b-2 font-bold transition-all ${
                    activeTab === "pageImages" ? "border-primary text-primary" : "border-transparent text-outline hover:text-on-surface"
                  }`}
                >
                  <ImageIcon size={14} />
                  PAGE IMAGES
                </button>
              </div>

              {/* Tab panels */}
              <div className="pt-4">
                <AnimatePresence mode="wait">
                  
                  {/* BOOKINGS TAB */}
                  {activeTab === "bookings" && (
                    <motion.div
                      key="bookings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="font-display-lg text-headline-sm text-on-surface">Client Appointment Slots</h2>
                        <span className="font-body-md text-xs text-on-surface-variant">Click checkmark to confirm pending slots.</span>
                      </div>

                      {bookings.length === 0 ? (
                        <div className="text-center py-16 text-on-surface-variant font-body-md text-sm bg-white/40 border border-outline-variant/30 rounded-xl">
                          No appointments booked yet.
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {bookings.map((booking) => (
                            <GlassCard 
                              key={booking._id} 
                              className={`p-6 rounded-xl border transition-all ${
                                booking.status === "Confirmed" ? "border-green-700/20 bg-green-50/10" : "border-outline-variant/30"
                              }`}
                              tiltEnabled={false}
                            >
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <h3 className="font-headline-sm text-lg text-on-surface">{booking.name}</h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest font-label-caps uppercase ${
                                      booking.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                                    }`}>
                                      {booking.status}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-6 font-body-md text-xs text-on-surface-variant">
                                    <span className="flex items-center gap-1.5"><Mail size={12} className="text-primary" /> {booking.email}</span>
                                    {booking.phone && <span className="flex items-center gap-1.5"><Phone size={12} className="text-primary" /> {booking.phone}</span>}
                                    <span className="flex items-center gap-1.5 font-semibold text-primary"><LayoutDashboard size={12} /> {booking.service}</span>
                                  </div>

                                  <div className="flex gap-4 font-body-md text-xs font-semibold text-on-surface pt-1.5">
                                    <span className="bg-surface-container px-2.5 py-1 rounded">Date: {booking.date}</span>
                                    <span className="bg-surface-container px-2.5 py-1 rounded">Time: {booking.time}</span>
                                  </div>

                                  {booking.notes && (
                                    <p className="font-body-md text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-lg border border-outline-variant/10 italic">
                                      &ldquo;{booking.notes}&rdquo;
                                    </p>
                                  )}
                                </div>

                                <div className="flex gap-2 shrink-0 self-end md:self-center">
                                  {booking.status === "Pending" && (
                                    <button
                                      onClick={() => handleUpdateBookingStatus(booking._id, "Confirmed")}
                                      className="p-2.5 bg-green-700/10 hover:bg-green-700/20 text-green-700 border border-green-700/20 rounded-full transition-all active:scale-90"
                                      title="Confirm Booking"
                                    >
                                      <Check size={16} />
                                    </button>
                                  )}
                                  {booking.status === "Confirmed" && (
                                    <button
                                      onClick={() => handleUpdateBookingStatus(booking._id, "Pending")}
                                      className="p-2.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-600 border border-amber-600/20 rounded-full transition-all active:scale-90"
                                      title="Set to Pending"
                                    >
                                      <Clock size={16} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteBooking(booking._id)}
                                    className="p-2.5 bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-full transition-all active:scale-90"
                                    title="Delete Booking"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </GlassCard>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* INQUIRIES TAB */}
                  {activeTab === "inquiries" && (
                    <motion.div
                      key="inquiries"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <h2 className="font-display-lg text-headline-sm text-on-surface">Academy Enrollment Forms</h2>
                      
                      {inquiries.length === 0 ? (
                        <div className="text-center py-16 text-on-surface-variant font-body-md text-sm bg-white/40 border border-outline-variant/30 rounded-xl">
                          No academy enrollment inquiries received yet.
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {inquiries.map((inq) => (
                            <GlassCard key={inq._id} className="p-6 rounded-xl border border-outline-variant/30" tiltEnabled={false}>
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-2">
                                  <h3 className="font-headline-sm text-lg text-on-surface">{inq.name}</h3>
                                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-body-md text-xs text-on-surface-variant">
                                    <span className="flex items-center gap-1.5"><Mail size={12} className="text-primary" /> {inq.email}</span>
                                    <span className="flex items-center gap-1.5 font-semibold text-primary"><BookOpen size={12} /> {inq.course}</span>
                                  </div>
                                  {inq.message && (
                                    <div className="font-body-md text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                                      <strong>Background:</strong> {inq.message}
                                    </div>
                                  )}
                                </div>

                                <button
                                  onClick={() => handleDeleteInquiry(inq._id)}
                                  className="p-2.5 bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-full transition-all active:scale-90"
                                  title="Delete Inquiry"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </GlassCard>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* SERVICES TAB */}
                  {activeTab === "services" && (
                    <motion.div
                      key="services"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="font-display-lg text-headline-sm text-on-surface">Signature Services Rates</h2>
                        {!showAddService && !editingService && (
                          <button
                            onClick={() => {
                              setServiceForm({ title: "", description: "", price: "", category: "Haircuts", icon: "scissors" });
                              setServiceImageFile(null);
                              setShowAddService(true);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-label-caps text-xs tracking-wider active:scale-95 transition-all shadow-sm font-semibold"
                          >
                            <Plus size={14} />
                            ADD SERVICE
                          </button>
                        )}
                      </div>

                      {/* Add/Edit service form card */}
                      {(showAddService || editingService) && (
                        <GlassCard className="p-6 rounded-xl border-primary/20 bg-white/90" tiltEnabled={false}>
                          <form onSubmit={editingService ? handleEditServiceSubmit : handleAddServiceSubmit} className="space-y-4 max-w-xl">
                            <h3 className="font-headline-sm text-base text-on-surface border-b border-outline-variant/30 pb-2">
                              {editingService ? `Edit Service: ${editingService.title}` : "New Service Details"}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Service Title *</label>
                                <input
                                  type="text"
                                  value={serviceForm.title}
                                  onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                                  required
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Starting Price *</label>
                                <input
                                  type="text"
                                  value={serviceForm.price}
                                  onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                                  placeholder="e.g. $85"
                                  required
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Category</label>
                                <input
                                  type="text"
                                  value={serviceForm.category}
                                  onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Icon Name</label>
                                <select
                                  value={serviceForm.icon}
                                  onChange={(e) => setServiceForm(prev => ({ ...prev, icon: e.target.value }))}
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                >
                                  <option value="scissors">Scissors (Haircut)</option>
                                  <option value="smile">Smile (Beard Grooming)</option>
                                  <option value="palette">Palette (Coloring)</option>
                                  <option value="wand">Wand (Styling)</option>
                                  <option value="crown">Crown (Dressing)</option>
                                  <option value="leaf">Leaf (Therapy/Treatment)</option>
                                  <option value="star">Star (Special Bridal)</option>
                                  <option value="shield">Shield (Consultation)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="font-label-caps text-[10px] text-outline">Description</label>
                              <textarea
                                value={serviceForm.description}
                                onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                                rows={2}
                                className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary resize-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-label-caps text-[10px] text-outline block">Service Cover Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setServiceImageFile(e.target.files[0]);
                                  }
                                }}
                                className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                              />
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                type="submit"
                                className="px-5 py-2.5 bg-primary text-on-primary font-label-caps text-xs tracking-wider rounded font-bold hover:opacity-90 active:scale-95 transition-all"
                              >
                                {editingService ? "SAVE CHANGES" : "CREATE SERVICE"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddService(false);
                                  setEditingService(null);
                                  setServiceImageFile(null);
                                }}
                                className="px-5 py-2.5 border border-outline-variant text-on-surface font-label-caps text-xs tracking-wider rounded"
                              >
                                CANCEL
                              </button>
                            </div>
                          </form>
                        </GlassCard>
                      )}

                      <div className="grid gap-4">
                        {services.map((service) => (
                          <GlassCard key={service._id} className="p-6 rounded-xl border border-outline-variant/30" tiltEnabled={false}>
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex gap-4">
                                {service.image && (
                                  <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-surface-container border border-outline-variant/10">
                                    <img 
                                      src={(service.image.startsWith("http") ? service.image : `${API_BASE_URL.replace("/api", "")}${service.image}`).replace(/\.(heic|heif)$/i, ".jpg")} 
                                      alt={service.title} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="font-headline-sm text-lg text-on-surface">{service.title}</h3>
                                    <span className="font-display-lg text-primary font-bold text-sm bg-primary/10 px-2.5 py-0.5 rounded">
                                      {service.price}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-outline bg-surface-container px-2 py-0.5 rounded">
                                      Icon: {service.icon || "scissors"}
                                    </span>
                                  </div>
                                  <p className="font-body-md text-xs text-on-surface-variant mt-2 max-w-2xl">
                                    {service.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setServiceForm({
                                      title: service.title,
                                      description: service.description || "",
                                      price: service.price,
                                      category: service.category || "Haircuts",
                                      icon: service.icon || "scissors"
                                    });
                                    setEditingService(service);
                                    setShowAddService(false);
                                  }}
                                  className="p-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full transition-all"
                                  title="Edit Service"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteService(service._id)}
                                  className="p-2.5 bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-full transition-all active:scale-95"
                                  title="Delete Service"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </GlassCard>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* GALLERY TAB */}
                  {activeTab === "gallery" && (
                    <motion.div
                      key="gallery"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="font-display-lg text-headline-sm text-on-surface">Gallery &amp; Video Media</h2>
                        {!showAddGallery && !editingGallery && (
                          <button
                            onClick={() => {
                              setShowAddGallery(true);
                              setGalleryForm({ title: "", category: "cuts", description: "", featured: "false", videoUrl: "" });
                              setGalleryFiles({});
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-label-caps text-xs tracking-wider active:scale-95 transition-all shadow-sm font-semibold"
                          >
                            <Plus size={14} />
                            UPLOAD MEDIA
                          </button>
                        )}
                      </div>

                      {(showAddGallery || editingGallery) && (
                        <GlassCard className="p-6 rounded-xl border-primary/20 bg-white/90" tiltEnabled={false}>
                          <form onSubmit={editingGallery ? handleEditGallerySubmit : handleAddGallerySubmit} className="space-y-4 max-w-xl">
                            <h3 className="font-headline-sm text-base text-on-surface border-b border-outline-variant/30 pb-2">
                              {editingGallery ? `Edit Media: ${editingGallery.title}` : "New Media Upload"}
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Media Title *</label>
                                <input
                                  type="text"
                                  value={galleryForm.title}
                                  onChange={(e) => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                                  required
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Showcase Category *</label>
                                <select
                                  value={galleryForm.category}
                                  onChange={(e) => setGalleryForm(prev => ({ ...prev, category: e.target.value as GalleryItem["category"] }))}
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                >
                                  <option value="cuts">Precision Cuts (Cuts)</option>
                                  <option value="colors">Advanced Coloring (Colors)</option>
                                  <option value="styling">Editorial Styling (Styling)</option>
                                  <option value="bridal">Bridal Styling (Bridal)</option>
                                  <option value="grooming">Grooming Heritage (Grooming)</option>
                                  <option value="studio">Our Studio (Studio)</option>
                                  <option value="transformations">Before/After Transformation</option>
                                  <option value="reels">MP4 Reels / Videos</option>
                                  <option value="instagram">Instagram Post</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Mark Featured?</label>
                                <select
                                  value={galleryForm.featured}
                                  onChange={(e) => setGalleryForm(prev => ({ ...prev, featured: e.target.value }))}
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                >
                                  <option value="false">Standard Gallery</option>
                                  <option value="true">Featured Showcase Item</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Description</label>
                                <input
                                  type="text"
                                  value={galleryForm.description}
                                  onChange={(e) => setGalleryForm(prev => ({ ...prev, description: e.target.value }))}
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                />
                              </div>
                            </div>

                            {/* DYNAMIC FILE UPLOAD INPUTS BASED ON CATEGORY */}
                            {galleryForm.category === "transformations" ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-surface-container rounded border border-outline-variant/30">
                                <div className="space-y-1">
                                  <label className="font-label-caps text-[10px] text-primary block">BEFORE Image *</label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    required={!editingGallery}
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        setGalleryFiles(prev => ({ ...prev, beforeImage: file }));
                                      }
                                    }}
                                    className="block w-full text-xs text-on-surface-variant file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary cursor-pointer"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="font-label-caps text-[10px] text-primary block">AFTER Image *</label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    required={!editingGallery}
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        setGalleryFiles(prev => ({ ...prev, afterImage: file }));
                                      }
                                    }}
                                    className="block w-full text-xs text-on-surface-variant file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary cursor-pointer"
                                  />
                                </div>
                              </div>
                            ) : galleryForm.category === "reels" ? (
                              <div className="p-3 bg-surface-container rounded border border-outline-variant/30 space-y-4">
                                <div className="space-y-1">
                                  <label className="font-label-caps text-[10px] text-outline block">Reel Source Option *</label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center gap-2 font-body-md text-xs text-on-surface cursor-pointer select-none">
                                      <input
                                        type="radio"
                                        name="reelSource"
                                        checked={reelSource === "upload"}
                                        onChange={() => {
                                          setReelSource("upload");
                                          setGalleryForm(prev => ({ ...prev, videoUrl: "" }));
                                          setGalleryFiles({});
                                        }}
                                      />
                                      Upload local MP4 video file
                                    </label>
                                    <label className="flex items-center gap-2 font-body-md text-xs text-on-surface cursor-pointer select-none">
                                      <input
                                        type="radio"
                                        name="reelSource"
                                        checked={reelSource === "url"}
                                        onChange={() => {
                                          setReelSource("url");
                                          setGalleryFiles({});
                                        }}
                                      />
                                      Link external video URL
                                    </label>
                                  </div>
                                </div>

                                {reelSource === "upload" ? (
                                  <div className="space-y-3 border-t border-outline-variant/20 pt-3">
                                    <div className="space-y-1">
                                      <label className="font-label-caps text-[10px] text-primary block">Select Video File (.mp4, .mov) *</label>
                                      <input
                                        type="file"
                                        accept="video/mp4,video/quicktime,video/*"
                                        required={!editingGallery}
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            setGalleryFiles(prev => ({ ...prev, file }));
                                          }
                                        }}
                                        className="block w-full text-xs text-on-surface-variant file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary cursor-pointer"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="font-label-caps text-[10px] text-primary block">Reel Thumbnail Image (Video Card Cover)</label>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            setGalleryFiles(prev => ({ ...prev, thumbnail: file }));
                                          }
                                        }}
                                        className="block w-full text-xs text-on-surface-variant file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3 border-t border-outline-variant/20 pt-3">
                                    <div className="space-y-1">
                                      <label className="font-label-caps text-[10px] text-primary block">Reel Thumbnail Image (Video Card Cover)</label>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            setGalleryFiles(prev => ({ ...prev, file }));
                                          }
                                        }}
                                        className="block w-full text-xs text-on-surface-variant file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary cursor-pointer"
                                      />
                                    </div>
                                    <div className="space-y-1 pt-1">
                                      <label className="font-label-caps text-[10px] text-primary block">Paste Reel Video URL (Instagram / YouTube shorts link) *</label>
                                      <input
                                        type="text"
                                        placeholder="https://instagram.com/reel/..."
                                        value={galleryForm.videoUrl}
                                        required={!editingGallery}
                                        onChange={(e) => setGalleryForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                                        className="block w-full px-3 py-1.5 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-3 bg-surface-container rounded border border-outline-variant/30 space-y-1">
                                <label className="font-label-caps text-[10px] text-primary block">Select Portfolio Image File *</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  required={!editingGallery}
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      setGalleryFiles(prev => ({ ...prev, file }));
                                    }
                                  }}
                                  className="block w-full text-xs text-on-surface-variant file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary cursor-pointer"
                                />
                              </div>
                            )}

                            <div className="flex gap-2 pt-2">
                              <button
                                type="submit"
                                className="px-5 py-2.5 bg-primary text-on-primary font-label-caps text-xs tracking-wider rounded font-bold hover:opacity-90 active:scale-95 transition-all"
                              >
                                {editingGallery ? "SAVE CHANGES" : "UPLOAD & SAVE"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddGallery(false);
                                  setEditingGallery(null);
                                  setGalleryFiles({});
                                }}
                                className="px-5 py-2.5 border border-outline-variant text-on-surface font-label-caps text-xs tracking-wider rounded"
                              >
                                CANCEL
                              </button>
                            </div>
                          </form>
                        </GlassCard>
                      )}

                      {/* Displaying list of current items */}
                      {galleryItems.length === 0 ? (
                        <div className="text-center py-16 text-on-surface-variant font-body-md text-sm bg-white/40 border border-outline-variant/30 rounded-xl">
                          No media uploads saved in gallery yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {galleryItems.map((item) => {
                            const isLocalImg = item.imageUrl && !item.imageUrl.startsWith("http");
                            const resolvedImg = item.imageUrl 
                              ? (isLocalImg ? `${API_BASE_URL.replace("/api", "")}${item.imageUrl}` : item.imageUrl)
                              : item.beforeImageUrl?.startsWith("http") ? item.beforeImageUrl : `${API_BASE_URL.replace("/api", "")}${item.beforeImageUrl}`;
                            const imgUrl = resolvedImg?.replace(/\.(heic|heif)$/i, ".jpg") || getEmbedUrl(item.videoUrl || "").thumbnailUrl || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500";

                            return (
                              <GlassCard key={item._id} className="p-3 rounded-xl border border-outline-variant/30 flex flex-col justify-between" tiltEnabled={false}>
                                <div className="space-y-2">
                                  <div className="aspect-[4/3] rounded overflow-hidden bg-surface-container relative group border border-outline-variant/10">
                                    <img 
                                      src={imgUrl || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500"} 
                                      alt={item.title} 
                                      className="w-full h-full object-cover"
                                    />
                                    <span className="absolute top-2 left-2 bg-inverse-surface/80 text-surface text-[8px] font-bold px-2 py-0.5 rounded tracking-widest font-label-caps uppercase">
                                      {item.category}
                                    </span>
                                    {item.featured && (
                                      <span className="absolute top-2 right-2 bg-primary text-on-primary text-[8px] font-bold px-2 py-0.5 rounded tracking-widest">
                                        ★ FEATURED
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-headline-sm text-sm text-on-surface line-clamp-1">{item.title}</h4>
                                    <p className="font-body-md text-[10px] text-on-surface-variant line-clamp-1 italic">{item.description || "No description"}</p>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setGalleryForm({
                                        title: item.title,
                                        category: item.category,
                                        description: item.description || "",
                                        featured: item.featured ? "true" : "false",
                                        videoUrl: item.videoUrl || ""
                                      });
                                      setEditingGallery(item);
                                      setShowAddGallery(false);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full font-label-caps text-[9px] tracking-wider active:scale-95 transition-all shadow-sm font-semibold"
                                    title="Edit Media Item"
                                  >
                                    <Edit2 size={10} />
                                    EDIT
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGalleryItem(item._id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-error/10 hover:bg-error/20 text-error rounded-full font-label-caps text-[9px] tracking-wider active:scale-95 transition-all shadow-sm font-semibold"
                                  >
                                    <Trash2 size={10} />
                                    DELETE
                                  </button>
                                </div>
                              </GlassCard>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TESTIMONIALS TAB */}
                  {activeTab === "testimonials" && (
                    <motion.div
                      key="testimonials"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="font-display-lg text-headline-sm text-on-surface">Client Reviews &amp; Testimonials</h2>
                        {!showAddTestimonial && !editingTestimonial && (
                          <button
                            onClick={() => {
                              setShowAddTestimonial(true);
                              setTestimonialForm({ clientName: "", rating: "5", feedback: "" });
                              setTestimonialFile(null);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-label-caps text-xs tracking-wider active:scale-95 transition-all shadow-sm font-semibold"
                          >
                            <Plus size={14} />
                            ADD TESTIMONIAL
                          </button>
                        )}
                      </div>

                      {(showAddTestimonial || editingTestimonial) && (
                        <GlassCard className="p-6 rounded-xl border-primary/20 bg-white/90" tiltEnabled={false}>
                          <form onSubmit={editingTestimonial ? handleEditTestimonialSubmit : handleAddTestimonialSubmit} className="space-y-4 max-w-xl">
                            <h3 className="font-headline-sm text-base text-on-surface border-b border-outline-variant/30 pb-2">
                              {editingTestimonial ? `Edit Testimonial: ${editingTestimonial.clientName}` : "New Testimonial Details"}
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Client Name *</label>
                                <input
                                  type="text"
                                  value={testimonialForm.clientName}
                                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, clientName: e.target.value }))}
                                  required
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Rating (1 to 5 Stars) *</label>
                                <select
                                  value={testimonialForm.rating}
                                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, rating: e.target.value }))}
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                >
                                  <option value="5">5 Stars (Excellent)</option>
                                  <option value="4">4 Stars (Good)</option>
                                  <option value="3">3 Stars (Average)</option>
                                  <option value="2">2 Stars (Poor)</option>
                                  <option value="1">1 Star (Very Bad)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="font-label-caps text-[10px] text-outline">Client Feedback Review *</label>
                              <textarea
                                value={testimonialForm.feedback}
                                onChange={(e) => setTestimonialForm(prev => ({ ...prev, feedback: e.target.value }))}
                                required
                                rows={3}
                                className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary resize-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-label-caps text-[10px] text-outline block">Client Avatar Image File</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setTestimonialFile(e.target.files[0]);
                                  }
                                }}
                                className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                              />
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                type="submit"
                                className="px-5 py-2.5 bg-primary text-on-primary font-label-caps text-xs tracking-wider rounded font-bold hover:opacity-90 active:scale-95 transition-all"
                              >
                                {editingTestimonial ? "SAVE CHANGES" : "SAVE TESTIMONIAL"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddTestimonial(false);
                                  setEditingTestimonial(null);
                                  setTestimonialFile(null);
                                }}
                                className="px-5 py-2.5 border border-outline-variant text-on-surface font-label-caps text-xs tracking-wider rounded"
                              >
                                CANCEL
                              </button>
                            </div>
                          </form>
                        </GlassCard>
                      )}

                      <div className="grid gap-4">
                        {testimonials.map((t) => {
                          const isBackendImage = t.image && !t.image.startsWith("http");
                          const resolvedImg = t.image 
                            ? (isBackendImage ? `${API_BASE_URL.replace("/api", "")}${t.image}` : t.image)
                            : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100";
                          const imgUrl = resolvedImg?.replace(/\.(heic|heif)$/i, ".jpg");

                          return (
                            <GlassCard key={t._id} className="p-6 rounded-xl border border-outline-variant/30" tiltEnabled={false}>
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex gap-4">
                                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container border border-outline-variant/10 shadow-sm">
                                    <img src={imgUrl} alt={t.clientName} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                      <h3 className="font-headline-sm text-base text-on-surface">{t.clientName}</h3>
                                      <div className="flex text-amber-500 text-xs">
                                        {Array.from({ length: t.rating }).map((_, i) => (
                                          <Star key={i} size={12} className="fill-amber-500" />
                                        ))}
                                      </div>
                                    </div>
                                    <p className="font-body-md text-xs text-on-surface-variant italic leading-relaxed">
                                      &ldquo;{t.feedback}&rdquo;
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setTestimonialForm({
                                        clientName: t.clientName,
                                        rating: String(t.rating),
                                        feedback: t.feedback
                                      });
                                      setEditingTestimonial(t);
                                      setShowAddTestimonial(false);
                                    }}
                                    className="p-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full transition-all"
                                    title="Edit Testimonial"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTestimonial(t._id)}
                                    className="p-2.5 bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-full transition-all active:scale-95"
                                    title="Delete Review"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </GlassCard>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ACADEMY COURSES TAB */}
                  {activeTab === "courses" && (
                    <motion.div
                      key="courses"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="font-display-lg text-headline-sm text-on-surface">Training Programs (Courses)</h2>
                        {!showAddCourse && !editingCourse && (
                          <button
                            onClick={() => {
                              setCourseForm({ title: "", description: "", duration: "", price: "", level: "Advanced", syllabusText: "" });
                              setCourseFile(null);
                              setShowAddCourse(true);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-label-caps text-xs tracking-wider active:scale-95 transition-all shadow-sm font-semibold"
                          >
                            <Plus size={14} />
                            ADD COURSE
                          </button>
                        )}
                      </div>

                      {(showAddCourse || editingCourse) && (
                        <GlassCard className="p-6 rounded-xl border-primary/20 bg-white/90" tiltEnabled={false}>
                          <form onSubmit={editingCourse ? handleEditCourseSubmit : handleAddCourseSubmit} className="space-y-4 max-w-xl">
                            <h3 className="font-headline-sm text-base text-on-surface border-b border-outline-variant/30 pb-2">
                              {editingCourse ? `Edit Course Details: ${editingCourse.title}` : "New Course Program Details"}
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Course Title *</label>
                                <input
                                  type="text"
                                  value={courseForm.title}
                                  onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                                  required
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Course Level *</label>
                                <select
                                  value={courseForm.level}
                                  onChange={(e) => setCourseForm(prev => ({ ...prev, level: e.target.value as Course["level"] }))}
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                >
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Advanced">Advanced</option>
                                  <option value="Masterclass">Masterclass</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Duration (e.g. 3 Months Full-Time) *</label>
                                <input
                                  type="text"
                                  value={courseForm.duration}
                                  onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                                  required
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-label-caps text-[10px] text-outline">Price Starting Rate *</label>
                                <input
                                  type="text"
                                  value={courseForm.price}
                                  onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                                  placeholder="e.g. $1,200"
                                  required
                                  className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="font-label-caps text-[10px] text-outline">Course Description *</label>
                              <textarea
                                value={courseForm.description}
                                onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                                required
                                rows={2}
                                className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary resize-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-label-caps text-[10px] text-outline">Course Syllabus Topics (Separate items with commas) *</label>
                              <textarea
                                value={courseForm.syllabusText}
                                onChange={(e) => setCourseForm(prev => ({ ...prev, syllabusText: e.target.value }))}
                                placeholder="Topic 1, Topic 2, Topic 3"
                                required
                                rows={2}
                                className="block w-full px-3 py-2 bg-surface border border-outline-variant rounded font-body-md text-on-surface text-sm outline-none focus:border-primary resize-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-label-caps text-[10px] text-outline block">Course Program Image File</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setCourseFile(e.target.files[0]);
                                  }
                                }}
                                className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                              />
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                type="submit"
                                className="px-5 py-2.5 bg-primary text-on-primary font-label-caps text-xs tracking-wider rounded font-bold hover:opacity-90 active:scale-95 transition-all"
                              >
                                {editingCourse ? "SAVE CHANGES" : "SAVE COURSE"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddCourse(false);
                                  setEditingCourse(null);
                                  setCourseFile(null);
                                }}
                                className="px-5 py-2.5 border border-outline-variant text-on-surface font-label-caps text-xs tracking-wider rounded"
                              >
                                CANCEL
                              </button>
                            </div>
                          </form>
                        </GlassCard>
                      )}

                      <div className="grid gap-4">
                        {courses.map((course) => (
                          <GlassCard key={course._id} className="p-6 rounded-xl border border-outline-variant/30" tiltEnabled={false}>
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex gap-4">
                                {course.image && (
                                  <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-surface-container border border-outline-variant/10">
                                    <img 
                                      src={(course.image.startsWith("http") ? course.image : `${API_BASE_URL.replace("/api", "")}${course.image}`).replace(/\.(heic|heif)$/i, ".jpg")} 
                                      alt={course.title} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="font-headline-sm text-lg text-on-surface">{course.title}</h3>
                                    <span className="font-display-lg text-primary font-bold text-xs bg-primary/10 px-2 py-0.5 rounded">
                                      {course.level}
                                    </span>
                                    <span className="bg-surface-container px-2 py-0.5 rounded text-xs font-semibold text-on-surface">
                                      {course.duration}
                                    </span>
                                    <span className="text-primary font-bold text-xs">
                                      {course.price}
                                    </span>
                                  </div>
                                  <p className="font-body-md text-xs text-on-surface-variant mt-2 max-w-xl leading-relaxed">
                                    {course.description}
                                  </p>
                                  {course.syllabus && course.syllabus.length > 0 && (
                                    <div className="mt-2.5">
                                      <span className="font-label-caps text-[9px] text-outline font-bold block mb-1">SYLLABUS ITEMS:</span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {course.syllabus.map((s, idx) => (
                                          <span key={idx} className="bg-primary/5 border border-primary/15 text-[10px] text-primary px-2.5 py-0.5 rounded-full">
                                            {s}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setCourseForm({
                                      title: course.title,
                                      description: course.description,
                                      duration: course.duration,
                                      price: course.price,
                                      level: course.level,
                                      syllabusText: course.syllabus.join(", ")
                                    });
                                    setEditingCourse(course);
                                    setShowAddCourse(false);
                                  }}
                                  className="p-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full transition-all"
                                  title="Edit Course"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(course._id)}
                                  className="p-2.5 bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-full transition-all active:scale-95"
                                  title="Delete Course"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </GlassCard>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* PAGE IMAGES TAB */}
                  {activeTab === "pageImages" && (
                    <motion.div
                      key="pageImages"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="font-display-lg text-headline-sm text-on-surface">Page Section Images</h2>
                        <span className="font-body-md text-xs text-on-surface-variant">
                          Upload custom images to customize static segments of your pages.
                        </span>
                      </div>

                      <div className="grid gap-6">
                        {["Home", "Services", "About", "Portfolio", "Booking"].map((pageName) => {
                          const pageSections = EDITABLE_SECTIONS.filter(s => s.pageName === pageName);
                          return (
                            <div key={pageName} className="space-y-4">
                              <h3 className="font-label-caps text-sm text-primary tracking-widest border-b border-outline-variant/30 pb-2 uppercase">
                                {pageName} Page Sections
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pageSections.map((sect) => {
                                  const customConfig = sectionImages.find(img => img.key === sect.key);
                                  const currentImageUrl = customConfig ? customConfig.imageUrl : sect.fallbackUrl;
                                  
                                  const resolvedSrc = currentImageUrl.startsWith("http")
                                    ? currentImageUrl
                                    : `${API_BASE_URL.replace("/api", "")}${currentImageUrl}`;
                                    
                                  const normalizedSrc = resolvedSrc.replace(/\.(heic|heif)$/i, ".jpg");

                                  return (
                                    <GlassCard key={sect.key} className="p-4 rounded-xl border border-outline-variant/30 flex gap-4 items-center" tiltEnabled={false}>
                                      <div className="w-24 h-24 rounded overflow-hidden shrink-0 bg-surface-container border border-outline-variant/10 relative group">
                                        <img 
                                          src={normalizedSrc} 
                                          alt={sect.sectionName} 
                                          className="w-full h-full object-cover"
                                        />
                                        {!customConfig && (
                                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="text-[9px] text-white font-label-caps tracking-wider bg-black/60 px-1.5 py-0.5 rounded">DEFAULT</span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex-grow space-y-2">
                                        <div>
                                          <h4 className="font-headline-sm text-sm text-on-surface">{sect.sectionName}</h4>
                                          <p className="text-[10px] text-outline font-mono">key: {sect.key}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <input
                                            type="file"
                                            id={`file-${sect.key}`}
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              if (e.target.files && e.target.files[0]) {
                                                handleSectionImageUpload(sect.key, e.target.files[0], sect.pageName, sect.sectionName);
                                              }
                                            }}
                                          />
                                          <label
                                            htmlFor={`file-${sect.key}`}
                                            className={`px-4 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded text-xs font-semibold font-label-caps cursor-pointer tracking-wider transition-all flex items-center gap-1.5 ${
                                              uploadingSectionKey === sect.key ? "opacity-50 pointer-events-none" : ""
                                            }`}
                                          >
                                            {uploadingSectionKey === sect.key ? "UPLOADING..." : "UPLOAD NEW"}
                                          </label>
                                        </div>
                                      </div>
                                    </GlassCard>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          )}

        </div>
      </main>

      <PremiumFooter />
    </>
  );
}
