"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function LuxuryNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Portfolio", href: "/portfolio" },
    { name: "Services", href: "/services" },
    { name: "Training Academy", href: "/academy" },
    { name: "About", href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 h-20 flex items-center ${
        scrolled
          ? "bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-md"
          : "bg-surface/60 backdrop-blur-xl border-b border-outline-variant/10"
      }`}
    >
      <div className="flex justify-between items-center w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop h-full">
        {/* Brand Title */}
        <Link
          href="/"
          className="font-display-lg text-lg lg:text-headline-sm tracking-tighter text-on-surface hover:opacity-85 transition-opacity"
        >
          RAHUL S TIPUKADE
        </Link>

        {/* Desktop Navigation links */}
        <nav className="hidden lg:flex items-center gap-gutter">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors font-body-md text-body-md pb-1 relative group ${
                  isActive
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
                {!isActive && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Booking CTA Button (Desktop) */}
        <div className="hidden lg:block">
          <Link href="/booking">
            <button className="bg-inverse-surface text-surface-bright px-8 py-3 rounded-full font-button-text text-button-text hover:scale-105 active:scale-95 transition-all">
              Book Appointment
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-on-surface focus:outline-none hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 flex flex-col px-margin-mobile py-6 gap-6 lg:hidden shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-body-md text-body-lg py-2 ${
                  isActive
                    ? "text-primary font-semibold border-l-4 border-primary pl-3"
                    : "text-on-surface-variant hover:text-primary pl-3"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link href="/booking" onClick={() => setIsOpen(false)} className="w-full mt-4">
            <button className="w-full bg-inverse-surface text-surface-bright py-4 rounded-full font-button-text text-button-text hover:opacity-90 active:scale-95 transition-all">
              Book Appointment
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
