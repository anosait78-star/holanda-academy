"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Trash2, X, FolderPlus } from "lucide-react";

interface Category { _id: string; name: string; slug: string }
interface GalleryImg { _id: string; url: string; caption?: string; categoryId?: string }

export default function AdminGalleryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<GalleryImg[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [showCatModal, setShowCatModal] = useState(false);

  const load = async () => {
    const [catRes, imgRes] = await Promise.all([
      fetch("/api/gallery/categories").then((r) => r.json()),
      fetch("/api/gallery/images").then((r) => r.json()),
    ]);
    setCategories(Array.isArray(catRes) ? catRes : []);
    setImages(Array.isArray(imgRes) ? imgRes : []);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "gallery");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (!uploadRes.ok) continue;
        const { url, publicId } = await uploadRes.json();
        await fetch("/api/gallery/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, publicId, categoryId: activeCategory !== "all" ? activeCategory : null }),
        });
      }
      toast.success(`تم رفع ${files.length} صورة`);
      load();
    } catch { toast.error("فشل الرفع"); }
    finally { setUploading(false); }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("حذف الصورة؟")) return;
    const res = await fetch(`/api/gallery/images/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("تم الحذف"); load(); }
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const res = await fetch("/api/gallery/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCatName }) });
    if (res.ok) { setNewCatName(""); setShowCatModal(false); toast.success("تم إضافة التصنيف"); load(); }
  };

  const filtered = activeCategory === "all" ? images : images.filter((i) => i.categoryId === activeCategory);

  return (
    <div>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">المعرض</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowCatModal(true)} className="btn-outline text-sm py-2"><FolderPlus size={16} /> تصنيف جديد</button>
          <label className={`btn-primary text-sm py-2 cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <Plus size={16} /> {uploading ? "جارٍ الرفع..." : "رفع صور"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setActiveCategory("all")} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === "all" ? "bg-primary text-white" : "bg-dark-200 text-gray-400 hover:text-white"}`}>
          الكل ({images.length})
        </button>
        {categories.map((cat) => (
          <button key={cat._id} onClick={() => setActiveCategory(cat._id)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === cat._id ? "bg-primary text-white" : "bg-dark-200 text-gray-400 hover:text-white"}`}>
            {cat.name} ({images.filter((i) => i.categoryId === cat._id).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">لا توجد صور. ارفع صوراً جديدة.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((img) => (
            <div key={img._id} className="group relative aspect-square rounded-xl overflow-hidden bg-dark-200">
              <Image src={img.url} alt="صورة" fill className="object-cover" />
              <button onClick={() => deleteImage(img._id)} className="absolute top-2 left-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showCatModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-100 border border-dark-300 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">تصنيف جديد</h2>
              <button onClick={() => setShowCatModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="admin-input mb-4" placeholder="اسم التصنيف" />
            <button onClick={addCategory} className="btn-primary w-full justify-center">إضافة</button>
          </div>
        </div>
      )}
    </div>
  );
}
