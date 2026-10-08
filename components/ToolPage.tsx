"use client";

import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HowItWorks from "./HowItWorks";

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "green" | "amber";
  children: React.ReactNode;
  howItWorks?: { title: string; desc: string }[];
};

const COLOR_MAP = {
  blue: { bg: "bg-blue-100", text: "text-blue-600", ring: "ring-blue-100" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", ring: "ring-purple-100" },
  green: { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-100" },
  amber: { bg: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-100" },
};

export default function ToolPage({
  title,
  description,
  icon: Icon,
  color,
  children,
  howItWorks,
}: Props) {
  const c = COLOR_MAP[color];

  return (
    <div className="min-h-screen relative flex flex-col">
      <AnimatedBackground />
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10 relative flex-1 w-full">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to dashboard
        </Link>

        <div className="fade-in-up glass rounded-3xl shadow-lg border border-white/60 p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200/60">
            <div
              className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center ring-4 ${c.ring}`}
            >
              <Icon className={`w-7 h-7 ${c.text}`} strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
          </div>

          <div className="space-y-6">{children}</div>
        </div>

        {/* How it works */}
        <HowItWorks steps={howItWorks} />
      </main>

      <Footer />
    </div>
  );
}