"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Scissors,
  FileArchive,
  Image as ImageIcon,
  RefreshCw,
  Zap,
  Layers,
  Check,
  Shield,
  Rocket,
  Clock,
} from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  const tools = [
    { icon: Layers, name: "Merge PDFs", color: "text-blue-600 bg-blue-100" },
    { icon: Scissors, name: "Split PDF", color: "text-blue-600 bg-blue-100" },
    { icon: FileArchive, name: "Compress PDF", color: "text-blue-600 bg-blue-100" },
    { icon: ImageIcon, name: "PDF → Images", color: "text-amber-600 bg-amber-100" },
    { icon: FileText, name: "PDF → Word", color: "text-purple-600 bg-purple-100" },
    { icon: RefreshCw, name: "Convert Images", color: "text-emerald-600 bg-emerald-100" },
    { icon: Zap, name: "Compress Images", color: "text-amber-600 bg-amber-100" },
    { icon: FileText, name: "Word → PDF", color: "text-purple-600 bg-purple-100" },
    { icon: FileText, name: "Excel → PDF", color: "text-emerald-600 bg-emerald-100" },
  ];

  const features = [
    { icon: Shield, title: "Private & Secure", desc: "Files processed on our servers, never shared." },
    { icon: Rocket, title: "Blazing Fast", desc: "Optimized pipeline delivers results in seconds." },
    { icon: Clock, title: "Always Free", desc: "No ads, no limits, no signup needed for basic tools." },
  ];

  return (
    <div className="min-h-screen overflow-hidden relative">
      <AnimatedBackground />

      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto flex justify-between items-center px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl text-slate-900">DocMind AI</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg text-slate-700 hover:bg-white/60 backdrop-blur transition-colors font-medium"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="btn-primary px-5 py-2 rounded-lg text-white font-medium"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-slate-200 text-sm text-slate-700 mb-8 shadow-sm fade-in-up">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          15 tools · 100% free · No ads
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-[1.05] tracking-tight fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          All your document tools
          <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-2">
            in one beautiful place
          </span>
        </h1>

        <p
          className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          Merge, split, compress, convert — PDFs, Office files, images and
          spreadsheets. Fast, secure, and completely free.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3 justify-center fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <Link
            href="/register"
            className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white text-lg font-medium group"
          >
            Start free
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-slate-700 text-lg font-medium bg-white/70 backdrop-blur border border-white/60 hover:bg-white/90 transition-all"
          >
            I have an account
          </Link>
        </div>
      </section>

      {/* Floating tool cards */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tools.map((t, i) => (
            <div
              key={i}
              className="glass p-4 rounded-2xl shadow-sm flex items-center gap-3 card-3d fade-in-up"
              style={{ animationDelay: `${400 + i * 60}ms` }}
            >
              <div
                className={`w-10 h-10 rounded-lg ${t.color} flex items-center justify-center flex-shrink-0`}
              >
                <t.icon className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <span className="font-medium text-slate-800">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass p-6 rounded-2xl border border-white/60 card-3d fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-md">
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-semibold text-slate-900 mb-1">{f.title}</div>
              <div className="text-sm text-slate-600 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="relative z-10 py-10">
        <div className="max-w-3xl mx-auto text-center px-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-600">
            {["No ads, no limits", "Privacy-first", "Batches supported", "Works on any device"].map(
              (t) => (
                <div key={t} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{t}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 animated-grid opacity-20" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-slate-300 mb-8 text-lg">
              Create a free account. No credit card required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors group"
            >
              Start free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}