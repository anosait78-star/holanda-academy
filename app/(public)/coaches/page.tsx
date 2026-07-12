export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getCoaches } from "@/lib/api";
import CoachesGrid from "@/components/public/CoachesGrid";

export const metadata: Metadata = { title: "المدربون" };

export default async function CoachesPage() {
  const coaches = await getCoaches();

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">فريقنا</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">كادرنا التدريبي</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">فريق من أفضل المدربين ذوي الخبرات المحلية والدولية</p>
        </div>

        {!coaches.length ? (
          <div className="text-center py-20 text-gray-500">لا يوجد مدربون متاحون حالياً</div>
        ) : (
          <CoachesGrid coaches={coaches} />
        )}
      </div>
    </div>
  );
}
