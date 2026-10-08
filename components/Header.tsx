"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Sparkles,
  LayoutDashboard,
  Wrench,
  DollarSign,
  BookOpen,
  LogOut,
  User,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "#", label: "Pricing", icon: DollarSign },
  { href: "#", label: "Docs", icon: BookOpen },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? undefined);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? undefined);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    router.push("/");
  }

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link
          href={email ? "/dashboard" : "/"}
          className="flex items-center gap-2 group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-slate-900 hidden sm:inline">
            DocMind AI
          </span>
        </Link>

        {/* Desktop nav */}
        {email && (
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    active
                      ? "bg-slate-900/5 text-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-900/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex-1" />

        {email ? (
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur border border-white/60 hover:bg-white text-slate-500 hover:text-slate-700 transition-colors text-sm"
              title="Search (coming soon)"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs">Search</span>
              <kbd className="hidden xl:inline-block ml-2 px-1.5 py-0.5 text-[10px] rounded bg-slate-100 text-slate-500 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Notifications */}
            <button
              className="relative w-9 h-9 rounded-lg bg-white/60 backdrop-blur border border-white/60 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/60 backdrop-blur border border-white/60 hover:bg-white transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {email[0]?.toUpperCase()}
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden fade-in">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {email}
                    </div>
                    <div className="text-xs text-slate-500">Free plan</div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-lg bg-white/60 backdrop-blur border border-white/60 hover:bg-white flex items-center justify-center text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-slate-700 hover:bg-white/60 backdrop-blur transition-colors text-sm font-medium"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="btn-primary px-4 py-2 rounded-lg text-white text-sm font-medium"
            >
              Get started
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {email && mobileMenuOpen && (
        <div className="md:hidden border-t border-white/40 bg-white/90 backdrop-blur-xl fade-in">
          <nav className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-slate-900/5 text-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-900/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}