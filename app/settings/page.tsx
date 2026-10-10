"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sun,
  Bell,
  Sparkles,
  Shield,
  AlertTriangle,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { getSettings, updateSettings, deleteAllFiles } from "@/app/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

type Settings = {
  theme: "light" | "dark" | "system";
  notifications_email: boolean;
  notifications_marketing: boolean;
  default_output_format: "jpg" | "png" | "webp";
  auto_delete_days: number;
  analytics_opt_in: boolean;
};

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
        return;
      }
      load();
    });
  }, [router]);

  async function load() {
  const DEFAULT_SETTINGS: Settings = {
    theme: "system",
    notifications_email: true,
    notifications_marketing: false,
    default_output_format: "jpg",
    auto_delete_days: 0,
    analytics_opt_in: true,
  };

  try {
    const res = await getSettings();
    // Merge returned settings with defaults (fills any missing fields)
    setSettings({
      ...DEFAULT_SETTINGS,
      ...(res.settings || {}),
    });
  } catch (e: any) {
    // Even if backend fails, use defaults so buttons work
    setSettings(DEFAULT_SETTINGS);
    console.warn("Using default settings:", e.message);
  } finally {
    setLoading(false);
  }
}

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await updateSettings(settings);
      setSettings(res.settings);
      setMessage("✅ Settings saved");
      setTimeout(() => setMessage(""), 3000);
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAllFiles() {
    if (!confirm("Delete ALL your files? This cannot be undone.")) return;
    try {
      const res = await deleteAllFiles();
      setMessage(`✅ Deleted ${res.deleted} file(s)`);
      setConfirmDelete(false);
    } catch (e: any) {
      setMessage("❌ " + e.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      <AnimatedBackground />
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10 relative flex-1 w-full">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to dashboard
        </Link>

        <div className="mb-8 fade-in-up">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Settings
          </h1>
          <p className="text-slate-600 mt-1">
            Customize how DocMind AI works for you
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 text-sm rounded-xl px-4 py-3 border flex items-center gap-2 ${
              message.startsWith("✅")
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.startsWith("✅") ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message}
          </div>
        )}

        {/* 1. Appearance */}
        <Section title="Appearance" icon={Sun} description="Theme preference">
          <Row label="Theme">
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update("theme", t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    settings?.theme === t
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        {/* 2. Notifications */}
        <Section
          title="Notifications"
          icon={Bell}
          description="Email preferences"
        >
          <ToggleRow
            label="Job completion emails"
            hint="Get an email when your file processing finishes"
            checked={!!settings?.notifications_email}
            onChange={(v) => update("notifications_email", v)}
          />
          <ToggleRow
            label="Product updates"
            hint="Occasional emails about new features"
            checked={!!settings?.notifications_marketing}
            onChange={(v) => update("notifications_marketing", v)}
          />
        </Section>

        {/* 3. Defaults */}
        <Section
          title="Defaults"
          icon={Sparkles}
          description="Preferred output settings"
        >
          <Row label="Default output format">
            <div className="flex gap-2">
              {(["jpg", "png", "webp"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => update("default_output_format", f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium uppercase transition-all ${
                    settings?.default_output_format === f
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        {/* 4. Privacy */}
        <Section title="Privacy" icon={Shield} description="Data preferences">
          <Row label="Auto-delete old files">
            <select
              value={settings?.auto_delete_days ?? 0}
              onChange={(e) => update("auto_delete_days", Number(e.target.value))}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-900 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value={0}>Never</option>
              <option value={7}>After 7 days</option>
              <option value={30}>After 30 days</option>
              <option value={90}>After 90 days</option>
            </select>
          </Row>
          <ToggleRow
            label="Anonymous usage analytics"
            hint="Help us improve by sharing anonymous usage data"
            checked={!!settings?.analytics_opt_in}
            onChange={(v) => update("analytics_opt_in", v)}
          />
        </Section>

        {/* Save button */}
        <div className="sticky bottom-6 z-10">
          <div className="glass rounded-2xl border border-white/60 shadow-lg p-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Changes aren&apos;t applied until saved
            </span>
            <button
              onClick={save}
              disabled={saving}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5. Danger Zone */}
        <Section
          title="Danger Zone"
          icon={AlertTriangle}
          description="Irreversible actions"
          danger
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="font-medium text-slate-900">Delete all files</div>
              <div className="text-sm text-slate-500">
                Permanently remove every file you&apos;ve uploaded or created
              </div>
            </div>
            <button
              onClick={handleDeleteAllFiles}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" />
              Delete all files
            </button>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

/* ============== Helper Components ============== */

function Section({
  title,
  icon: Icon,
  description,
  danger,
  children,
}: {
  title: string;
  icon: any;
  description: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fade-in-up glass rounded-3xl shadow-lg border border-white/60 p-6 mb-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/60">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            danger ? "bg-red-100" : "bg-slate-100"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${danger ? "text-red-600" : "text-slate-600"}`}
          />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-900">{label}</div>
        <div className="text-xs text-slate-500 mt-0.5">{hint}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? "bg-blue-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}