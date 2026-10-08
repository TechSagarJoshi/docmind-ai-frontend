"use client";

import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
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
  SplitSquareHorizontal,
  CopyX,
  Filter,
  ScanText,
  Layers,
  Combine,
  RefreshCw,
  Zap,
  Upload,
  Trash2,
  Download,
  RotateCw,
  FileOutput,
  Hash,
  Stamp,
  Mail,
  Phone,
  Database,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { listFiles, uploadFile, getDownloadUrl, deleteFile } from "@/app/lib/api";
import Header from "@/components/Header";
import ToolCard from "@/components/ToolCard";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
        return;
      }
      setUser(data.session.user);
      refresh();
    });
  }, [router]);

  async function refresh() {
    try {
      const res = await listFiles();
      setFiles(res.files || []);
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setMessage("");
    try {
      await uploadFile(f);
      setMessage("✅ Uploaded");
      await refresh();
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onDownload(id: string) {
    try {
      const { url } = await getDownloadUrl(id);
      window.open(url, "_blank");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this file?")) return;
    try {
      await deleteFile(id);
      setMessage("✅ Deleted");
      await refresh();
    } catch (e: any) {
      setMessage("❌ " + e.message);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
          <div className="text-slate-500 text-sm">Loading…</div>
        </div>
      </div>
    );
  }

  const categories = [
    {
      title: "PDF Tools",
      color: "blue" as const,
      tools: [
        { href: "/tools/merge", label: "Merge PDFs", desc: "Combine multiple", icon: Layers },
        { href: "/tools/split", label: "Split PDF", desc: "Extract ranges", icon: Scissors },
        { href: "/tools/compress", label: "Compress PDF", desc: "Reduce size", icon: FileArchive },
        { href: "/tools/rotate-pdf", label: "Rotate PDF", desc: "Rotate pages", icon: RotateCw },
        { href: "/tools/extract-pages", label: "Extract Pages", desc: "Pull specific pages", icon: FileOutput },
        { href: "/tools/delete-pages", label: "Delete Pages", desc: "Remove unwanted", icon: Trash2 },
        { href: "/tools/page-numbers", label: "Page Numbers", desc: "Number every page", icon: Hash },
        { href: "/tools/watermark-pdf", label: "Watermark", desc: "Stamp text on pages", icon: Stamp },
        { href: "/tools/pdf-to-text", label: "PDF → Text", desc: "Plain text extraction", icon: FileType2 },
        { href: "/tools/text-to-pdf", label: "Text → PDF", desc: "Convert .txt to PDF", icon: FileText },
        { href: "/tools/ocr-pdf", label: "OCR PDF", desc: "Read scanned PDFs", icon: ScanText },
      ],
    },
        {
      title: "Data Extraction",
      color: "green" as const,
      tools: [
        { href: "/tools/extract-emails", label: "Extract Emails", desc: "Find all emails in a PDF", icon: Mail },
        { href: "/tools/extract-phones", label: "Extract Phones", desc: "Find all phone numbers", icon: Phone },
        { href: "/tools/extract-all", label: "Extract All Data", desc: "Emails, phones, GSTIN, dates → CSV", icon: Database },
      ],
    },
    {
      title: "PDF ↔ Office",
      color: "purple" as const,
      tools: [
        { href: "/tools/pdf-to-word", label: "PDF → Word", desc: "Edit as .docx", icon: FileType2 },
        { href: "/tools/word-to-pdf", label: "Word → PDF", desc: "Convert .docx", icon: FileText },
        { href: "/tools/excel-to-pdf", label: "Excel → PDF", desc: "Spreadsheet to PDF", icon: FileSpreadsheet },
        { href: "/tools/ppt-to-pdf", label: "Slides → PDF", desc: "PowerPoint to PDF", icon: Presentation },
      ],
    },
    {
      title: "Spreadsheets",
      color: "green" as const,
      tools: [
        { href: "/tools/excel-to-csv", label: "Excel → CSV", desc: "Spreadsheet to CSV", icon: Table },
        { href: "/tools/csv-to-excel", label: "CSV → Excel", desc: "CSV to spreadsheet", icon: Grid3x3 },
        { href: "/tools/merge-excel", label: "Merge Excel", desc: "Join workbooks", icon: Combine },
        { href: "/tools/merge-csv", label: "Merge CSV", desc: "Stack CSVs", icon: Layers },
        { href: "/tools/split-excel", label: "Split Excel", desc: "One file per sheet", icon: SplitSquareHorizontal },
        { href: "/tools/remove-duplicates", label: "Remove Duplicates", desc: "Dedupe rows", icon: CopyX },
        { href: "/tools/remove-empty-rows", label: "Remove Empty Rows", desc: "Clean up blanks", icon: Filter },
      ],
    },
    {
      title: "Images & PDF",
      color: "amber" as const,
      tools: [
        { href: "/tools/pdf-to-images", label: "PDF → Images", desc: "Export pages", icon: FileImage },
        { href: "/tools/images-to-pdf", label: "Images → PDF", desc: "Combine images", icon: ImageIcon },
        { href: "/tools/image-convert", label: "Image Converter", desc: "JPG ↔ PNG ↔ WEBP", icon: RefreshCw },
        { href: "/tools/image-compress", label: "Image Compressor", desc: "Reduce size", icon: Zap },
      ],
    },
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10 relative">
        <div className="mb-12 fade-in-up">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
            Your Toolkit
          </h1>
          <p className="text-slate-600">
            Convert, merge, compress — 29 tools in one place.
          </p>
        </div>

        <div className="space-y-12 mb-16">
          {categories.map((cat, ci) => (
            <div
              key={cat.title}
              className="fade-in-up"
              style={{ animationDelay: `${ci * 80}ms` }}
            >
              <div className="flex items-center gap-4 mb-5">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                  {cat.title}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.tools.map((t) => (
                  <ToolCard
                    key={t.href}
                    href={t.href}
                    label={t.label}
                    desc={t.desc}
                    icon={t.icon}
                    color={cat.color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="fade-in-up">
          <div className="flex items-center gap-4 mb-5">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              Your Files
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />
          </div>

          <div className="glass p-5 rounded-2xl border border-white/60 mb-4 card-3d">
            <label className="block cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">
                    {uploading ? "Uploading…" : "Upload a file"}
                  </div>
                  <div className="text-sm text-slate-500">
                    Click to select, or drag and drop
                  </div>
                </div>
                <input
                  type="file"
                  onChange={onUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {message && (
            <div className="mb-4 text-sm text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200">
              {message}
            </div>
          )}

          <div className="glass rounded-2xl border border-white/60 overflow-hidden shadow-sm">
            {files.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-slate-400" />
                </div>
                <div className="text-slate-500">
                  No files yet — upload one above.
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 flex justify-between items-center hover:bg-slate-50/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 truncate">
                          {f.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {(f.size / 1024).toFixed(1)} KB ·{" "}
                          {new Date(f.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onDownload(f.id)}
                        className="text-sm px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                      <button
                        onClick={() => onDelete(f.id)}
                        className="text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}