export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgramBySlug } from "@/lib/api";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  return { title: program?.title || "البرنامج", description: program?.shortDescription || "" };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="relative h-64 md:h-96 bg-dark-200">
        {program.mainImage && (
          <Image src={program.mainImage} alt={program.title} fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 p-8">
          <div className="max-w-7xl mx-auto">
            <span className="bg-primary text-white text-sm px-3 py-1 rounded-full font-medium">{program.ageGroup}</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-3">{program.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">{program.shortDescription}</p>
            {program.fullDescription && (
              <div className="text-gray-400 leading-relaxed whitespace-pre-line">{program.fullDescription}</div>
            )}
            {program.galleryImages && program.galleryImages.length > 0 && (
              <div className="mt-12">
                <h2 className="text-white font-bold text-2xl mb-6">صور البرنامج</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {program.galleryImages.map((img, i) => (
                    <div key={i} className="aspect-square relative rounded-xl overflow-hidden">
                      <Image src={img.url} alt="صورة البرنامج" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="card p-6 sticky top-28">
              <h3 className="text-white font-bold text-xl mb-4">سجّل في هذا البرنامج</h3>
              <p className="text-gray-400 text-sm mb-6">انضم الآن واحصل على تجربة تدريبية استثنائية</p>
              <Link href="/registration" className="btn-primary w-full justify-center">سجّل الآن</Link>
              <Link href="/contact" className="btn-outline w-full justify-center mt-3">تواصل معنا</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
