"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Coach { _id: string; name: string; position: string; experience?: string; biography?: string; photo?: string; photoPublicId?: string }

const schema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  position: z.string().min(2, "المنصب مطلوب"),
  experience: z.string().optional(),
  biography: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

async function uploadFile(file: File, folder: string) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  return res.json() as Promise<{ url: string; publicId: string }>;
}

export default function AdminCoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Coach | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const load = async () => {
    const res = await fetch("/api/coaches");
    setCoaches(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); reset({ name: "", position: "", experience: "", biography: "" }); setPhotoFile(null); setShowModal(true); };
  const openEdit = (c: Coach) => { setEditing(c); reset({ name: c.name, position: c.position, experience: c.experience || "", biography: c.biography || "" }); setPhotoFile(null); setShowModal(true); };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      let photo = editing?.photo;
      let photoPublicId = editing?.photoPublicId;
      if (photoFile) {
        const uploaded = await uploadFile(photoFile, "coaches");
        photo = uploaded.url;
        photoPublicId = uploaded.publicId;
      }
      const payload = { ...data, photo, photoPublicId };
      const url = editing ? `/api/coaches/${editing._id}` : "/api/coaches";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "تم التحديث" : "تم الإضافة");
      setShowModal(false);
      load();
    } catch { toast.error("حدث خطأ"); }
    finally { setSubmitting(false); }
  };

  const deleteCoach = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    const res = await fetch(`/api/coaches/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("تم الحذف"); load(); }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">المدربون</h1>
        <button onClick={openCreate} className="btn-primary text-sm py-2"><Plus size={16} /> إضافة مدرب</button>
      </div>

      {loading ? <div className="text-gray-400 text-center py-20">جارٍ التحميل...</div> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {coaches.length === 0 ? <p className="col-span-4 text-center py-12 text-gray-500">لا يوجد مدربون</p> :
            coaches.map((c) => (
              <div key={c._id} className="bg-dark-100 border border-dark-300 rounded-xl p-5 text-center">
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-dark-200 mb-3">
                  {c.photo ? <Image src={c.photo} alt={c.name} width={64} height={64} className="object-cover w-full h-full" /> : <span className="text-2xl flex items-center justify-center h-full">👤</span>}
                </div>
                <p className="text-white font-semibold text-sm">{c.name}</p>
                <p className="text-primary text-xs mt-1 mb-3">{c.position}</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => deleteCoach(c._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-100 border border-dark-300 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-dark-300">
              <h2 className="text-white font-semibold">{editing ? "تعديل المدرب" : "إضافة مدرب"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div><label className="admin-label">الاسم *</label><input {...register("name")} className="admin-input" />{errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}</div>
              <div><label className="admin-label">المنصب *</label><input {...register("position")} className="admin-input" placeholder="مثال: مدرب أول" />{errors.position && <p className="text-red-400 text-xs mt-1">{errors.position.message}</p>}</div>
              <div><label className="admin-label">سنوات الخبرة</label><input {...register("experience")} className="admin-input" placeholder="مثال: 10 سنوات" /></div>
              <div><label className="admin-label">السيرة الذاتية</label><textarea {...register("biography")} className="admin-input resize-none" rows={3} /></div>
              <div>
                <label className="admin-label">الصورة الشخصية</label>
                <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} className="admin-input" />
                {editing?.photo && !photoFile && <Image src={editing.photo} alt={editing.name} width={60} height={60} className="rounded-full mt-2 object-cover" />}
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
