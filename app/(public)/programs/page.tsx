export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPrograms } from "@/lib/api";

export const metadata: Metadata = { title: "البرامج التدريبية" };

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">برامجنا</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">البرامج التدريبية</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">اختر البرنامج المناسب لعمر ومستوى لاعبك</p>
        </div>

        {!programs.length ? (
          <div className="text-center py-20 text-gray-500">لا توجد برامج متاحة حالياً</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Link key={String(program._id)} href={`/programs/${program.slug}`} className="card group hover:-translate-y-1 transition-transform duration-300">
                <div className="aspect-video bg-dark-200 relative overflow-hidden">
                  {program.mainImage ? (
                    <Image src={program.mainImage} alt={program.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">⚽</div>
                  )}
                  <div className="absolute top-3 right-3 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                    {program.ageGroup}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-white font-bold text-xl mb-3">{program.title}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{program.shortDescription}</p>
                  <div className="mt-5 text-primary text-sm font-medium">اعرف أكثر ←</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
