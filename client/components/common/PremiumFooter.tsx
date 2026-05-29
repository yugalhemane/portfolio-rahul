"use client";

import Link from "next/link";
import { Globe, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

export default function PremiumFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 w-full pt-stack-lg pb-stack-sm mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Brand info */}
        <div className="col-span-1 md:col-span-1">
          <div className="font-display-lg text-headline-md text-on-surface mb-6">
            RAHUL S TIPUKADE
          </div>
          <p className="text-on-surface-variant mb-6 pr-4 font-body-md text-body-md leading-relaxed">
            Crafting excellence in grooming and hair styling with over two decades of professional mastery.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-white transition-all text-on-surface-variant"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Globe size={18} />
            </a>
            <a
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-white transition-all text-on-surface-variant"
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-youtube"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                <polygon points="10 15 15 12 10 9" />
              </svg>
            </a>
            <a
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-white transition-all text-on-surface-variant"
              href="https://wa.me"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Services links */}
        <div>
          <h5 className="font-label-caps text-label-caps text-on-surface mb-6">SERVICES</h5>
          <ul className="space-y-4 font-body-md text-body-md">
            <li>
              <Link href="/services" className="text-on-surface-variant hover:text-primary transition-colors">
                Men's Grooming
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-on-surface-variant hover:text-primary transition-colors">
                Women's Styling
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-on-surface-variant hover:text-primary transition-colors">
                Hair Coloring
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-on-surface-variant hover:text-primary transition-colors">
                Bridal Styling
              </Link>
            </li>
          </ul>
        </div>

        {/* Academy links */}
        <div>
          <h5 className="font-label-caps text-label-caps text-on-surface mb-6">ACADEMY</h5>
          <ul className="space-y-4 font-body-md text-body-md">
            <li>
              <Link href="/academy" className="text-on-surface-variant hover:text-primary transition-colors">
                Foundation Course
              </Link>
            </li>
            <li>
              <Link href="/academy" className="text-on-surface-variant hover:text-primary transition-colors">
                Masterclasses
              </Link>
            </li>
            <li>
              <Link href="/academy" className="text-on-surface-variant hover:text-primary transition-colors">
                Grooming Workshops
              </Link>
            </li>
            <li>
              <Link href="/academy" className="text-on-surface-variant hover:text-primary transition-colors">
                Certification
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact links */}
        <div>
          <h5 className="font-label-caps text-label-caps text-on-surface mb-6">CONTACT</h5>
          <ul className="space-y-4 font-body-md text-body-md">
            <li className="flex items-center gap-3 text-on-surface-variant">
              <Mail size={16} className="text-primary shrink-0" />
              <span>contact@rahulst.com</span>
            </li>
            <li className="flex items-center gap-3 text-on-surface-variant">
              <Phone size={16} className="text-primary shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3 text-on-surface-variant">
              <MapPin size={16} className="text-primary shrink-0" />
              <span>Luxury Studio, Gokak, India</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-stack-lg pt-stack-sm border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-body-md">
        <p className="text-on-surface-variant">
          © {new Date().getFullYear()} Rahul S Tipukade. Designed with style.
        </p>
        <div className="flex gap-6 text-on-surface-variant">
          <Link href="/portfolio" className="hover:text-primary transition-colors">
            Portfolio
          </Link>
          <Link href="/services" className="hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/academy" className="hover:text-primary transition-colors">
            Academy
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
