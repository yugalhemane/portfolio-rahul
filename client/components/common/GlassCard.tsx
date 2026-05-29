"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tiltEnabled?: boolean;
}

export default function GlassCard({ children, className = "", tiltEnabled = true }: GlassCardProps) {
  return (
    <div
      style={{
        transition: "box-shadow 0.4s, border-color 0.4s, transform 0.4s",
      }}
      className={`glass-card p-6 rounded-xl border border-outline-variant/30 bg-white/70 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:scale-[1.01] ${className}`}
    >
      {children}
    </div>
  );
}

