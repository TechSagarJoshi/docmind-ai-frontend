"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Scissors,
  FileArchive,
  Image as ImageIcon,
  FileImage,
  FileType2,
  FileSpreadsheet,
  Presentation,
  Table,
  Grid3x3,
  Layers,
  Combine,
  RefreshCw,
  Zap,
  Upload,
  RotateCw,
  FileOutput,
  Trash2,
  Hash,
  Stamp,
  Search,
  Star,
  X,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import TiltCard from "@/components/TiltCard";

type Tool = {
  href: string;
  label: string;
  desc: string;
  icon: any;
  color: "blue" | "purple" | "green" | "amber";
  category: "PDF" | "Office" | "Spreadsheet" | "Image";
  keywords: string[];
};

const ALL_TOOLS: Tool[] = [
  // PDF
  { href: "/tools/merge", label: "Merge PDFs", desc: "Combine multiple PDFs into one", icon: Layers, color: "blue", category: "PDF", keywords: ["combine", "join", "union"] },
  { href: "/tools/split", label: "Split PDF", desc: "Extract page ranges into a new PDF", icon: Scissors, color: "blue", category: "PDF", keywords: ["cut", "separate", "extract"] },
  { href: "/tools/compress", label: "Compress PDF", desc: "Reduce PDF file size", icon: FileArchive, color: "blue", category: "PDF", keywords: ["shrink", "smaller", "optimize"] },
  { href: "/tools/rotate-pdf", label: "Rotate PDF", desc: "Rotate pages by 90°, 180°, 270°", icon: RotateCw, color: "blue", category: "PDF", keywords: ["turn", "spin", "orientation"] },
  { href: "/tools/extract-pages", label: "Extract Pages", desc: "Pull specific pages into a new PDF", icon: FileOutput, color: "blue", category: "PDF", keywords: ["select", "pick", "subset"] },
  { href: "/tools/delete-pages", label: "Delete Pages", desc: "Remove unwanted pages from PDF", icon: Trash2, color: "blue", category: "PDF", keywords: ["remove", "cut out"] },
  { href: "/tools/page-numbers", label: "Page Numbers", desc: "Number every page in your PDF", icon: Hash, color: "blue", category: "PDF", keywords: ["numbering", "paginate"] },
  { href: "/tools/watermark-pdf", label: "Watermark PDF", desc: "Add a diagonal text watermark", icon: Stamp, color: "blue", category: "PDF", keywords: ["stamp", "brand", "protect"] },

  // Office
  { href: "/tools/pdf-to-word", label: "PDF → Word", desc: "Convert PDF to editable .docx", icon: FileType2, color: "purple", category: "Office", keywords: ["docx", "document", "editable"] },
  { href: "/tools/word-to-pdf", label: "Word → PDF", desc: "Convert .docx files to PDF", icon: FileText, color: "purple", category: "Office", keywords: ["doc", "docx"] },
  { href: "/tools/excel-to-pdf", label: "Excel → PDF", desc: "Convert spreadsheets to PDF", icon: FileSpreadsheet, color: "purple", category: "Office", keywords: ["xlsx", "sheet"] },
  { href: "/tools/ppt-to-pdf", label: "Slides → PDF", desc: "Convert PowerPoint to PDF", icon: Presentation, color: "purple", category: "Office", keywords: ["pptx", "powerpoint", "slides"] },

  // Spreadsheet
  { href: "/tools/excel-to-csv", label: "Excel → CSV", desc: "Convert spreadsheet to CSV", icon: Table, color: "green", category: "Spreadsheet", keywords: ["xlsx", "csv", "export"] },
  { href: "/tools/csv-to-excel", label: "CSV → Excel", desc: "Convert CSV to spreadsheet", icon: Grid3x3, color: "green", category: "Spreadsheet", keywords: ["xlsx", "import"] },
  { href: "/tools/merge-excel", label: "Merge Excel", desc: "Join multiple workbooks as sheets", icon: Combine, color: "green", category: "Spreadsheet", keywords: ["combine", "join", "xlsx"] },
  { href: "/tools/merge-csv", label: "Merge CSV", desc: "Stack CSV files vertically", icon: Layers, color: "green", category: "Spreadsheet", keywords: ["combine", "append"] },

  // Image
  { href: "/tools/pdf-to-images", label: "PDF → Images", desc: "Export each page as JPG or PNG", icon: FileImage, color: "amber", category: "Image", keywords: ["jpg", "png", "rasterize"] },
  { href: "/tools/images-to-pdf", label: "Images → PDF", desc: "Combine images into a single PDF", icon: ImageIcon, color: "amber", category: "Image", keywords: ["jpg", "png", "combine"] },
  { href: "/tools/image-convert", label: "Image Converter", desc: "JPG ↔ PNG ↔ WEBP ↔ BMP ↔ TIFF", icon: RefreshCw, color: "amber", category: "Image", keywords: ["format", "convert"] },
  { href: "/tools/image-compress", label: "Image Compressor", desc: "Reduce image file size", icon: Zap, color: "amber", category: "Image", keywords: ["shrink", "smaller", "optimize"] },
];

const COLOR_MAP = {
  blue: { iconBg: "bg-blue-100", iconColor: "text-blue-600", glow: "glow-blue" },
  purple: { iconBg: "bg-purple-100", iconColor: "text-purple-600", glow: "glow-purple" },
  green: { iconBg: "bg-emerald-100", iconColor: "text-emerald-600", glow: "glow-green" },
  amber: { iconBg: "bg-amber-100", iconColor: "text-amber-600", glow: "glow-amber" },
};

const CATEGORIES = ["All", "PDF", "Office", "Spreadsheet", "Image"] as const;

export default function ToolsIndexPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
        return;
      }
      setLoading(false);
    });
  }, [router]);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("docmind_favorites");
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  // Save favorites
  function toggleFavorite(href: string) {
    setFavorites((prev) => {
      const next = prev.includes(href)
        ? prev.filter((h) => h !== href)
        : [...prev, href];
      try {
        localStorage.setItem("docmind_favorites", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Filtered tools
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_TOOLS.filter((t) => {
      if (category !== "All" && t.category !== category) return false;
      if (!q) return true;
      return (
        t.label.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q)) ||
        t.category.toLowerCase().includes(q)
      );
    });
  }, [search, category]);

  // Palette results
  const paletteResults = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase();
    if (!q) return ALL_TOOLS.slice(0, 8);
    return ALL_TOOLS.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q))
    ).slice(0, 12);
  }, [paletteQuery]);

  const favoritesList = ALL_TOOLS.filter((t) => favorites.includes(t.href));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      <AnimatedBackground />
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10 relative flex-1 w-full">
        {/* Title */}
        <div className="mb-10 fade-in-up">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
            All Tools
          </h1>
          <p className="text-slate-600">
            {ALL_TOOLS.length} document tools at your fingertips.
          </p>
        </div>

        {/* Search + Cmd+K hint */}
        <div className="mb-6 fade-in-up flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools…"
              className="w-full pl-11 pr-4 py-3 glass rounded-xl border border-white/60 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 px-4 py-3 glass rounded-xl border border-white/60 hover:bg-white text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            <span className="text-sm">Quick search</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Category tabs */}
        <div className="mb-8 fade-in-up flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const isActive = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "glass border border-white/60 text-slate-700 hover:bg-white"
                }`}
              >
                {c}
                <span className={`ml-2 text-xs ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                  {c === "All"
                    ? ALL_TOOLS.length
                    : ALL_TOOLS.filter((t) => t.category === c).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Favorites section */}
        {favoritesList.length > 0 && category === "All" && !search && (
          <div className="mb-12 fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Your Favorites
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoritesList.map((t) => (
                <ToolTile
                  key={t.href}
                  tool={t}
                  isFavorite
                  onToggleFavorite={() => toggleFavorite(t.href)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All tools grid */}
        <div className="fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              {search
                ? `Results (${filtered.length})`
                : category === "All"
                ? "All Tools"
                : `${category} Tools`}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
          </div>

          {filtered.length === 0 ? (
            <div className="glass rounded-2xl border border-white/60 p-12 text-center">
              <div className="inline-flex w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-4">
                <Search className="w-7 h-7 text-slate-400" />
              </div>
              <div className="text-slate-500">
                No tools match &quot;{search}&quot;
              </div>
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t) => (
                <ToolTile
                  key={t.href}
                  tool={t}
                  isFavorite={favorites.includes(t.href)}
                  onToggleFavorite={() => toggleFavorite(t.href)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Command palette modal */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4 bg-slate-900/40 backdrop-blur-sm fade-in"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                autoFocus
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Search tools…"
                className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                ESC
              </kbd>
            </div>

            <div className="max-h-96 overflow-y-auto py-2">
              {paletteResults.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-500 text-sm">
                  No tools found
                </div>
              ) : (
                paletteResults.map((t, i) => {
                  const c = COLOR_MAP[t.color];
                  const Icon = t.icon;
                  return (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setPaletteOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                        i === 0 ? "bg-slate-50/70" : ""
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg ${c.iconBg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-4 h-4 ${c.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900">
                          {t.label}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {t.desc}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{t.category}</span>
                    </Link>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
              <span>Navigate with ↑↓ · Enter to open</span>
              <span>{paletteResults.length} results</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

/* ---------- Tool Tile ---------- */

function ToolTile({
  tool,
  isFavorite,
  onToggleFavorite,
}: {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const c = COLOR_MAP[tool.color];
  const Icon = tool.icon;

  return (
    <TiltCard maxTilt={5}>
      <div
        className={`group relative glass rounded-2xl border border-white/60 ${c.glow} transition-shadow duration-300`}
      >
        <Link href={tool.href} className="block p-5">
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center`}
            >
              <Icon className={`w-6 h-6 ${c.iconColor}`} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <div className="font-semibold text-slate-900 mb-1">
                {tool.label}
              </div>
              <div className="text-sm text-slate-500 leading-snug">
                {tool.desc}
              </div>
            </div>
          </div>
        </Link>

        {/* Favorite star */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/70 hover:bg-white flex items-center justify-center transition-colors"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className={`w-3.5 h-3.5 transition-colors ${
              isFavorite ? "text-amber-500 fill-amber-500" : "text-slate-400"
            }`}
          />
        </button>
      </div>
    </TiltCard>
  );
}