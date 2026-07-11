export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Image from "next/image";
import { getCoaches } from "@/lib/api";

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coaches.map((coach) => (
              <div key={String(coach._id)} className="card group p-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-dark-200 mb-4 border-2 border-dark-300 group-hover:border-primary transition-all duration-300">
                  {coach.photo ? (
                    <Image src={coach.photo} alt={coach.name} width={96} height={96} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                  )}
                </div>
                <h2 className="text-white font-bold text-lg mb-1">{coach.name}</h2>
                <p className="text-primary text-sm font-medium mb-3">{coach.position}</p>
                {coach.experience && <p className="text-gray-500 text-xs mb-3">خبرة: {coach.experience}</p>}
                {coach.biography && <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{coach.biography}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
