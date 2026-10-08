"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6">Log in</h1>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        <label className="block mb-4">
          <span className="text-sm text-slate-700">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-lg" />
        </label>
        <label className="block mb-6">
          <span className="text-sm text-slate-700">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-lg" />
        </label>
        <button disabled={loading} className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">
          {loading ? "Logging in…" : "Log in"}
        </button>
        <p className="text-center mt-4 text-sm text-slate-600">
          No account? <Link href="/register" className="text-slate-900 font-medium">Register</Link>
        </p>
      </form>
    </div>
  );
}