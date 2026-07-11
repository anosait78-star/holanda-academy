export const dynamic = "force-dynamic";

import { getStats, getLatestRegistrations } from "@/lib/api";
import { FolderOpen, Users, Newspaper, ClipboardList } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const [stats, latestRegs] = await Promise.all([
    getStats(),
    getLatestRegistrations(10),
  ]);

  const cards = [
    { icon: FolderOpen, label: "البرامج", value: stats.programs, color: "text-blue-400", bg: "bg-blue-400/10" },
    { icon: Users, label: "المدربون", value: stats.coaches, color: "text-green-400", bg: "bg-green-400/10" },
    { icon: Newspaper, label: "الأخبار", value: stats.news, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { icon: ClipboardList, label: "التسجيلات", value: stats.registrations, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">لوحة التحكم</h1>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-dark-100 border border-dark-300 rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={card.color} size={20} />
            </div>
            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className="text-white font-bold text-2xl mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-dark-100 border border-dark-300 rounded-xl">
        <div className="p-5 border-b border-dark-300">
          <h2 className="text-white font-semibold">أحدث التسجيلات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-dark-300">
                <th className="text-right px-5 py-3 font-medium">اسم اللاعب</th>
                <th className="text-right px-5 py-3 font-medium">الجنس</th>
                <th className="text-right px-5 py-3 font-medium">تاريخ الميلاد</th>
                <th className="text-right px-5 py-3 font-medium">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {latestRegs.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">لا توجد تسجيلات بعد</td></tr>
              ) : latestRegs.map((reg) => (
                <tr key={String(reg._id)} className="border-b border-dark-300 last:border-0 hover:bg-dark-200 transition-colors">
                  <td className="px-5 py-3 text-white text-sm">{reg.playerName}</td>
                  <td className="px-5 py-3 text-gray-400 text-sm">{reg.gender === "male" ? "ذكر" : "أنثى"}</td>
                  <td className="px-5 py-3 text-gray-400 text-sm">{reg.dateOfBirth}</td>
                  <td className="px-5 py-3 text-gray-400 text-sm">{formatDate(String(reg.createdAt))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
