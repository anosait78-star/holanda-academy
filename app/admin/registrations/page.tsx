"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Download, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Registration { _id: string; playerName: string; gender: string; dateOfBirth: string; notes?: string; createdAt: string }

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filtered, setFiltered] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    const res = await fetch("/api/registrations");
    const data = await res.json();
    setRegistrations(data);
    setFiltered(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(registrations.filter((r) => r.playerName.toLowerCase().includes(q)));
  }, [search, registrations]);

  const deleteReg = async (id: string) => {
    if (!confirm("حذف التسجيل؟")) return;
    const res = await fetch(`/api/registrations/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("تم الحذف"); load(); }
  };

  const exportCSV = () => {
    const headers = ["اسم اللاعب", "الجنس", "تاريخ الميلاد", "ملاحظات", "تاريخ التسجيل"];
    const rows = filtered.map((r) => [r.playerName, r.gender === "male" ? "ذكر" : "أنثى", r.dateOfBirth, r.notes || "", formatDate(r.createdAt)]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">التسجيلات</h1>
        <button onClick={exportCSV} className="btn-outline text-sm py-2"><Download size={16} /> تصدير CSV</button>
      </div>
      <div className="relative mb-5">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="admin-input pr-10" placeholder="بحث باسم اللاعب..." />
      </div>
      {loading ? <div className="text-gray-400 text-center py-20">جارٍ التحميل...</div> : (
        <div className="bg-dark-100 border border-dark-300 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-dark-300 text-gray-400 text-sm">إجمالي: {filtered.length} تسجيل</div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-dark-300 text-gray-400 text-sm"><th className="text-right px-5 py-3 font-medium">اسم اللاعب</th><th className="text-right px-5 py-3 font-medium">الجنس</th><th className="text-right px-5 py-3 font-medium">تاريخ الميلاد</th><th className="text-right px-5 py-3 font-medium">ملاحظات</th><th className="text-right px-5 py-3 font-medium">تاريخ التسجيل</th><th className="px-5 py-3 w-16"></th></tr></thead>
              <tbody>
                {filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-500">لا توجد تسجيلات</td></tr> :
                  filtered.map((r) => (
                    <tr key={r._id} className="border-b border-dark-300 last:border-0 hover:bg-dark-200 transition-colors">
                      <td className="px-5 py-3 text-white text-sm font-medium">{r.playerName}</td>
                      <td className="px-5 py-3"><span className={`text-xs px-2.5 py-1 rounded-full ${r.gender === "male" ? "bg-blue-400/10 text-blue-400" : "bg-pink-400/10 text-pink-400"}`}>{r.gender === "male" ? "ذكر" : "أنثى"}</span></td>
                      <td className="px-5 py-3 text-gray-400 text-sm">{r.dateOfBirth}</td>
                      <td className="px-5 py-3 text-gray-400 text-sm max-w-xs truncate">{r.notes || "-"}</td>
                      <td className="px-5 py-3 text-gray-400 text-sm">{formatDate(r.createdAt)}</td>
                      <td className="px-5 py-3"><button onClick={() => deleteReg(r._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={15} /></button></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
