"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatDate } from "@/lib/utils";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Article { _id: string; title: string; slug: string; shortDescription?: string; fullContent?: string; featuredImage?: string; featuredImagePublicId?: string; publishDate: string }

const schema = z.object({
  title: z.string().min(2, "العنوان مطلوب"),
  shortDescription: z.string().optional(),
  fullContent: z.string().optional(),
  publishDate: z.string().min(1, "التاريخ مطلوب"),
});

type FormData = z.infer<typeof schema>;

async function uploadFile(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", "news");
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  return res.json() as Promise<{ url: string; publicId: string }>;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imgFile, setImgFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const load = async () => { const res = await fetch("/api/news"); setNews(await res.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); reset({ title: "", shortDescription: "", fullContent: "", publishDate: new Date().toISOString().split("T")[0] }); setImgFile(null); setShowModal(true); };
  const openEdit = (n: Article) => { setEditing(n); reset({ title: n.title, shortDescription: n.shortDescription || "", fullContent: n.fullContent || "", publishDate: n.publishDate?.split("T")[0] || "" }); setImgFile(null); setShowModal(true); };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      let featuredImage = editing?.featuredImage;
      let featuredImagePublicId = editing?.featuredImagePublicId;
      if (imgFile) {
        const uploaded = await uploadFile(imgFile);
        featuredImage = uploaded.url;
        featuredImagePublicId = uploaded.publicId;
      }
      const payload = { ...data, featuredImage, featuredImagePublicId };
      const url = editing ? `/api/news/${editing._id}` : "/api/news";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "تم التحديث" : "تم النشر");
      setShowModal(false);
      load();
    } catch { toast.error("حدث خطأ"); }
    finally { setSubmitting(false); }
  };

  const deleteNews = async (id: string) => {
    if (!confirm("حذف الخبر؟")) return;
    const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("تم الحذف"); load(); }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">الأخبار</h1>
        <button onClick={openCreate} className="btn-primary text-sm py-2"><Plus size={16} /> إضافة خبر</button>
      </div>

      {loading ? <div className="text-gray-400 text-center py-20">جارٍ التحميل...</div> : (
        <div className="bg-dark-100 border border-dark-300 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-dark-300 text-gray-400 text-sm"><th className="text-right px-5 py-3 font-medium">الخبر</th><th className="text-right px-5 py-3 font-medium">تاريخ النشر</th><th className="text-right px-5 py-3 font-medium w-24">إجراءات</th></tr></thead>
            <tbody>
              {news.length === 0 ? <tr><td colSpan={3} className="text-center py-12 text-gray-500">لا توجد أخبار</td></tr> :
                news.map((n) => (
                  <tr key={n._id} className="border-b border-dark-300 last:border-0 hover:bg-dark-200 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0">
                          {n.featuredImage ? <Image src={n.featuredImage} alt={n.title} width={48} height={40} className="object-cover w-full h-full" /> : <span className="flex items-center justify-center h-full text-lg">📰</span>}
                        </div>
                        <div><p className="text-white text-sm font-medium line-clamp-1">{n.title}</p><p className="text-gray-500 text-xs line-clamp-1">{n.shortDescription}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-sm">{formatDate(n.publishDate)}</td>
                    <td className="px-5 py-3"><div className="flex gap-2"><button onClick={() => openEdit(n)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Pencil size={15} /></button><button onClick={() => deleteNews(n._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={15} /></button></div></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-100 border border-dark-300 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-dark-300">
              <h2 className="text-white font-semibold">{editing ? "تعديل الخبر" : "إضافة خبر"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div><label className="admin-label">العنوان *</label><input {...register("title")} className="admin-input" />{errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}</div>
              <div><label className="admin-label">تاريخ النشر *</label><input {...register("publishDate")} type="date" className="admin-input" />{errors.publishDate && <p className="text-red-400 text-xs mt-1">{errors.publishDate.message}</p>}</div>
              <div><label className="admin-label">وصف مختصر</label><textarea {...register("shortDescription")} className="admin-input resize-none" rows={2} /></div>
              <div><label className="admin-label">المحتوى الكامل</label><textarea {...register("fullContent")} className="admin-input resize-none" rows={6} /></div>
              <div>
                <label className="admin-label">الصورة المميزة</label>
                <input type="file" accept="image/*" onChange={(e) => setImgFile(e.target.files?.[0] || null)} className="admin-input" />
                {editing?.featuredImage && !imgFile && <Image src={editing.featuredImage} alt="الصورة" width={120} height={70} className="rounded-lg mt-2 object-cover" />}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center disabled:opacity-50">{submitting ? "جارٍ الحفظ..." : "حفظ"}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
