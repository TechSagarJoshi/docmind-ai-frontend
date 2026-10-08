"use client";

import Link from "next/link";
import { Sparkles, Code2, AtSign, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-white/40">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg text-slate-900">DocMind AI</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              All your document tools in one place. Fast, secure, free.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                aria-label="Github"
                className="w-9 h-9 rounded-lg bg-white/60 backdrop-blur border border-white/60 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg bg-white/60 backdrop-blur border border-white/60 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              >
                <AtSign className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@docmind.ai"
                aria-label="Email"
                className="w-9 h-9 rounded-lg bg-white/60 backdrop-blur border border-white/60 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* PDF Tools */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">
              PDF Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/tools/merge" className="hover:text-slate-900 transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/split" className="hover:text-slate-900 transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/compress" className="hover:text-slate-900 transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-to-word" className="hover:text-slate-900 transition-colors">
                  PDF → Word
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-to-images" className="hover:text-slate-900 transition-colors">
                  PDF → Images
                </Link>
              </li>
            </ul>
          </div>

          {/* More tools */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">
              More Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/tools/image-convert" className="hover:text-slate-900 transition-colors">
                  Image Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/image-compress" className="hover:text-slate-900 transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/excel-to-csv" className="hover:text-slate-900 transition-colors">
                  Excel → CSV
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-excel" className="hover:text-slate-900 transition-colors">
                  Merge Excel
                </Link>
              </li>
              <li>
                <Link href="/tools/word-to-pdf" className="hover:text-slate-900 transition-colors">
                  Word → PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-slate-900 transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-slate-900 transition-colors">
                  Sign up free
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/40 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} DocMind AI — Built with Next.js, FastAPI & Supabase
          </div>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <span className="text-red-500">❤</span>
            <span>for the community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}