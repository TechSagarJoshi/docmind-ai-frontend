"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Languages,
  FileText,
  HardDrive,
  Sparkles,
  Save,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { getProfile, updateProfile } from "@/app/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  bio: string | null;
  location: string | null;
  language: string | null;
  plan: string;
  credits: number;
  created_at?: string;
};

type Stats = {
  files_count: number;
  storage_used: number;
  jobs_count: number;
};

const LANGUAGES = ["English", "Hindi", "Spanish", "French", "German", "Other"];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [message, setMessage] = useState("");

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("English");

  // Initials for avatar
  const initials =
    (profile?.full_name || profile?.email || "?")[0]?.toUpperCase() || "?";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
        return;
      }
      loadProfile();
    });
  }, [router]);

  async function loadProfile() {
    try {
      const res = await getProfile();
      const p = res.profile as Profile;
      setProfile(p);
      setStats(res.stats);
      setFullName(p.full_name || "");
      setPhone(p.phone || "");
      setBio(p.bio || "");
      setLocation(p.location || "");
      setLanguage(p.language || "English");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await updateProfile({
        full_name: fullName,
        phone,
        bio,
        location,
        language,
      });
      setProfile({ ...profile!, ...res.profile });
      setMessage("✅ Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setSaving(false);
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const storagePercent = stats
    ? Math.min((stats.storage_used / (1024 * 1024 * 1024)) * 100, 100)
    : 0;

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

        {/* Header card */}
        <div className="fade-in-up glass rounded-3xl shadow-lg border border-white/60 p-8 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 truncate">
                {profile?.full_name || "Unnamed User"}
              </h1>
              <p className="text-sm text-slate-500 truncate">{profile?.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium capitalize">
                  {profile?.plan || "Free"} plan
                </span>
                {profile?.created_at && (
                  <span className="text-xs text-slate-500">
                    Member since{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
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

        {/* Usage stats */}
        <div className="fade-in-up glass rounded-3xl shadow-lg border border-white/60 p-8 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">
            Usage & Plan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Files count */}
            <div className="bg-white/70 rounded-2xl p-4 border border-white/60">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <FileText className="w-3.5 h-3.5" />
                Files processed
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {stats?.jobs_count ?? 0}
              </div>
            </div>

            {/* Files stored */}
            <div className="bg-white/70 rounded-2xl p-4 border border-white/60">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <HardDrive className="w-3.5 h-3.5" />
                Files stored
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {stats?.files_count ?? 0}
              </div>
            </div>

            {/* Credits */}
            <div className="bg-white/70 rounded-2xl p-4 border border-white/60">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI credits
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {profile?.credits ?? 10}
              </div>
            </div>
          </div>

          {/* Storage bar */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm text-slate-600">Storage used</span>
              <span className="text-sm font-medium text-slate-900">
                {formatBytes(stats?.storage_used ?? 0)} / 1 GB
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${Math.max(storagePercent, 1)}%` }}
              />
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="mt-6 pt-6 border-t border-white/60 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-900">
                Want more? Upgrade to Pro
              </div>
              <div className="text-xs text-slate-500">
                Unlimited files, larger storage, priority support
              </div>
            </div>
            <button
              disabled
              className="px-4 py-2 rounded-xl bg-slate-900/5 text-slate-400 text-sm font-medium cursor-not-allowed"
              title="Coming soon"
            >
              Coming soon
            </button>
          </div>
        </div>

        {/* Profile form */}
        <div className="fade-in-up glass rounded-3xl shadow-lg border border-white/60 p-8 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">
            Profile Information
          </h2>

          <div className="space-y-5">
            {/* Email (read-only) */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email
              </span>
              <input
                value={profile?.email || ""}
                disabled
                className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-500 bg-slate-100 cursor-not-allowed"
              />
              <span className="text-xs text-slate-400 mt-1 block">
                Email is verified and cannot be changed here
              </span>
            </label>

            {/* Full name */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Full name
              </span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sagar Joshi"
                maxLength={100}
                className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </label>

            {/* Phone */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                Phone
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                maxLength={20}
                className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </label>

            {/* Location */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Location
              </span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, India"
                maxLength={100}
                className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </label>

            {/* Language */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Languages className="w-3.5 h-3.5" />
                Language
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>

            {/* Bio */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Bio
              </span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself…"
                maxLength={500}
                rows={3}
                className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
              <span className="text-xs text-slate-400 mt-1 block text-right">
                {bio.length} / 500
              </span>
            </label>
          </div>

          {/* Save button */}
          <div className="mt-6 pt-6 border-t border-white/60">
            <button
              onClick={handleSave}
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

        {/* Security section */}
        <div className="fade-in-up glass rounded-3xl shadow-lg border border-white/60 p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Security</h2>
          <button
            disabled
            className="px-6 py-3 rounded-xl bg-slate-900/5 text-slate-400 font-medium cursor-not-allowed"
            title="Coming soon"
          >
            Change password (coming soon)
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}