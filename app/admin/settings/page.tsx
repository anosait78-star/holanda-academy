"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { Save } from "lucide-react";

const SETTINGS_KEYS = [
  { key: "academy_name", label: "اسم الأكاديمية", type: "text" },
  { key: "whatsapp", label: "رقم واتساب (بدون +)", type: "text", placeholder: "966501234567" },
  { key: "email", label: "البريد الإلكتروني", type: "email" },
  { key: "address", label: "العنوان", type: "text" },
  { key: "footer_text", label: "نص الفوتر", type: "text" },
  { key: "google_map_url", label: "رابط خريطة Google (iframe src)", type: "text" },
  { key: "instagram", label: "رابط انستغرام", type: "url" },
  { key: "facebook", label: "رابط فيسبوك", type: "url" },
  { key: "twitter", label: "رابط تويتر/X", type: "url" },
  { key: "youtube", label: "رابط يوتيوب", type: "url" },
];

async function uploadFile(file: File, folder: string) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  return res.json() as Promise<{ url: string; publicId: string }>;
}

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("/logo.webp");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setValues(data);
      if (data.logo) setLogoPreview(data.logo);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedValues = { ...values };

      if (logoFile) {
        const uploaded = await uploadFile(logoFile, "logos");
        updatedValues.logo = uploaded.url;
        setLogoPreview(uploaded.url);
      }

      if (videoFile) {
        const uploaded = await uploadFile(videoFile, "videos");
        updatedValues.hero_video = uploaded.url;
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedValues),
      });

      if (!res.ok) throw new Error("Save failed");
      toast.success("تم حفظ الإعدادات");
    } catch {
      toast.error("حدث خطأ في الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-400 text-center py-20">جارٍ التحميل...</div>;

  return (
    <div>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">الإعدادات</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-50">
          <Save size={16} /> {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-dark-100 border border-dark-300 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">شعار الأكاديمية</h2>
          <div className="flex items-center gap-4 mb-4">
            <Image src={logoPreview} alt="الشعار" width={60} height={60} className="rounded-full border border-dark-300" onError={() => setLogoPreview("/logo.webp")} />
            <div><p className="text-gray-400 text-xs mb-1">الشعار الحالي</p><p className="text-gray-500 text-xs">JPG, PNG, WEBP</p></div>
          </div>
          <input type="file" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }
          }} className="admin-input" />
        </div>

        <div className="bg-dark-100 border border-dark-300 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">فيديو الصفحة الرئيسية</h2>
          <p className="text-gray-400 text-xs mb-3">MP4 مدعوم فقط — سيُرفع إلى Cloudinary</p>
          <input type="file" accept="video/mp4,video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="admin-input" />
          {videoFile && <p className="text-primary text-xs mt-2">✓ {videoFile.name}</p>}
        </div>

        {SETTINGS_KEYS.map((s) => (
          <div key={s.key} className="bg-dark-100 border border-dark-300 rounded-xl p-5">
            <label className="admin-label">{s.label}</label>
            <input
              type={s.type}
              value={values[s.key] || ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [s.key]: e.target.value }))}
              className="admin-input"
              placeholder={(s as { placeholder?: string }).placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
