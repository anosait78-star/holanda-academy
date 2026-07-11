"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "خطأ في تسجيل الدخول");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo.webp" alt="أكاديمية هولندا" width={110} height={110} className="rounded-full mx-auto mb-4" />
          <h1 className="text-white font-bold text-2xl">لوحة تحكم أكاديمية هولندا</h1>
          <p className="text-gray-400 text-sm mt-2">تسجيل دخول المسؤول</p>
        </div>
        <div className="card p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-5 text-sm">{error}</div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="admin-label">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input" placeholder="admin@holanda.com" required />
            </div>
            <div>
              <label className="admin-label">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-50">
              {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
