"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Program {
  _id: string;
  title: string;
  slug: string;
  ageGroup: string;
  shortDescription: string;
  fullDescription?: string;
  mainImage?: string;
  mainImagePublicId?: string;
}

const schema = z.object({
  title: z.string().min(2, "العنوان مطلوب"),
  ageGroup: z.string().min(1, "الفئة العمرية مطلوبة"),
  shortDescription: z.string().min(10, "الوصف المختصر مطلوب"),
  fullDescription: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

async function uploadFile(file: File, folder: string): Promise<{ url: string; publicId: string }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const load = async () => {
    const res = await fetch("/api/programs");
    setPrograms(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", ageGroup: "", shortDescription: "", fullDescription: "" });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (p: Program) => {
    setEditing(p);
    reset({ title: p.title, ageGroup: p.ageGroup, shortDescription: p.shortDescription, fullDescription: p.fullDescription || "" });
    setImageFile(null);
    setShowModal(true);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      let mainImage = editing?.mainImage;
      let mainImagePublicId = editing?.mainImagePublicId;

      if (imageFile) {
        const uploaded = await uploadFile(imageFile, "programs");
        mainImage = uploaded.url;
        mainImagePublicId = uploaded.publicId;
      }

      const payload = { ...data, mainImage, mainImagePublicId };
      const url = editing ? `/api/programs/${editing._id}` : "/api/programs";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed");

      toast.success(editing ? "تم التحديث" : "تم الإضافة");
      setShowModal(false);
      load();
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProgram = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("تم الحذف"); load(); }
    else toast.error("فشل الحذف");
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">البرامج</h1>
        <button onClick={openCreate} className="btn-primary text-sm py-2"><Plus size={16} /> إضافة برنامج</button>
      </div>

      {loading ? <div className="text-gray-400 text-center py-20">جارٍ التحميل...</div> : (
        <div className="bg-dark-100 border border-dark-300 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-300 text-gray-400 text-sm">
                <th className="text-right px-5 py-3 font-medium">البرنامج</th>
                <th className="text-right px-5 py-3 font-medium">الفئة العمرية</th>
                <th className="text-right px-5 py-3 font-medium w-32">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {programs.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-12 text-gray-500">لا توجد برامج</td></tr>
              ) : programs.map((p) => (
                <tr key={p._id} className="border-b border-dark-300 last:border-0 hover:bg-dark-200 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0">
                        {p.mainImage ? <Image src={p.mainImage} alt={p.title} width={40} height={40} className="object-cover w-full h-full" /> : <span className="text-lg flex items-center justify-center h-full">⚽</span>}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{p.title}</p>
                        <p className="text-gray-500 text-xs line-clamp-1">{p.shortDescription}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full">{p.ageGroup}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => deleteProgram(p._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-100 border border-dark-300 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-dark-300">
              <h2 className="text-white font-semibold">{editing ? "تعديل البرنامج" : "إضافة برنامج"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div>
                <label className="admin-label">العنوان *</label>
                <input {...register("title")} className="admin-input" />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="admin-label">الفئة العمرية *</label>
                <input {...register("ageGroup")} className="admin-input" placeholder="مثال: 8-12 سنة" />
                {errors.ageGroup && <p className="text-red-400 text-xs mt-1">{errors.ageGroup.message}</p>}
              </div>
              <div>
                <label className="admin-label">الوصف المختصر *</label>
                <textarea {...register("shortDescription")} className="admin-input resize-none" rows={2} />
                {errors.shortDescription && <p className="text-red-400 text-xs mt-1">{errors.shortDescription.message}</p>}
              </div>
              <div>
                <label className="admin-label">الوصف الكامل</label>
                <textarea {...register("fullDescription")} className="admin-input resize-none" rows={4} />
              </div>
              <div>
                <label className="admin-label">الصورة الرئيسية</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="admin-input" />
                {editing?.mainImage && !imageFile && (
                  <div className="mt-2"><Image src={editing.mainImage} alt="الصورة الحالية" width={80} height={50} className="rounded-lg object-cover" /></div>
                )}
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
