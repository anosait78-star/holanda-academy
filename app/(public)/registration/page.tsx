"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

const schema = z.object({
  playerName: z.string().min(2, "الاسم مطلوب"),
  gender: z.enum(["male", "female"], { message: "الجنس مطلوب" }),
  dateOfBirth: z.string().min(1, "تاريخ الميلاد مطلوب"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RegistrationPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Get WhatsApp number from settings
      const settingsRes = await fetch("/api/settings");
      const settings: Record<string, string> = await settingsRes.json();
      const whatsapp = settings.whatsapp || "";

      // Save to MongoDB
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Registration failed");

      toast.success("تم التسجيل بنجاح!");
      setSubmitted(true);

      // Open WhatsApp
      if (whatsapp) {
        const genderText = data.gender === "male" ? "ذكر" : "أنثى";
        const msg = `مرحباً، أود تسجيل لاعب في أكاديمية هولندا.\n\nاسم اللاعب: ${data.playerName}\nالجنس: ${genderText}\nتاريخ الميلاد: ${data.dateOfBirth}${data.notes ? `\nملاحظات: ${data.notes}` : ""}`;
        window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
      }
    } catch {
      toast.error("حدث خطأ، يرجى المحاولة مجدداً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <Toaster position="top-center" />
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">انضم إلينا</span>
          <h1 className="text-4xl font-bold text-white mt-3 mb-4">التسجيل في الأكاديمية</h1>
          <p className="text-gray-400">أكمل البيانات أدناه وسيتواصل معك فريقنا عبر واتساب</p>
        </div>

        {submitted ? (
          <div className="card p-10 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-white font-bold text-2xl mb-3">تم التسجيل بنجاح!</h2>
            <p className="text-gray-400 mb-6">شكراً لك! سيتواصل معك فريق أكاديمية هولندا قريباً عبر واتساب</p>
            <button onClick={() => setSubmitted(false)} className="btn-outline">تسجيل لاعب آخر</button>
          </div>
        ) : (
          <div className="card p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="admin-label">اسم اللاعب *</label>
                <input {...register("playerName")} className="admin-input" placeholder="أدخل اسم اللاعب كاملاً" />
                {errors.playerName && <p className="text-red-400 text-xs mt-1">{errors.playerName.message}</p>}
              </div>
              <div>
                <label className="admin-label">الجنس *</label>
                <select {...register("gender")} className="admin-input">
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
                {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender.message}</p>}
              </div>
              <div>
                <label className="admin-label">تاريخ الميلاد *</label>
                <input {...register("dateOfBirth")} type="date" className="admin-input" />
                {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <label className="admin-label">ملاحظات إضافية</label>
                <textarea {...register("notes")} className="admin-input resize-none" rows={3} placeholder="أي معلومات إضافية..." />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50">
                {loading ? "جارٍ التسجيل..." : "سجّل الآن عبر واتساب ⚽"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
