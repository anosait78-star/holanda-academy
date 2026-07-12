export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPrograms, getCoaches, getNews, getGalleryImages } from "@/lib/api";
import HeroVideo from "@/components/public/HeroVideo";
import SectionWrapper from "@/components/public/SectionWrapper";
import CoachesGrid from "@/components/public/CoachesGrid";
import { formatDate } from "@/lib/utils";
import { Trophy, Users, Star, Shield, Target, Award, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "أكاديمية هولندا لكرة القدم - الرئيسية",
};

const features = [
  { icon: Trophy, title: "تدريب احترافي", desc: "منهج تدريبي على أعلى المستويات العالمية" },
  { icon: Users, title: "مدربون متخصصون", desc: "كادر تدريبي متميز بخبرات محلية ودولية" },
  { icon: Star, title: "بيئة متكاملة", desc: "ملاعب ومرافق مجهزة بأحدث التقنيات" },
  { icon: Shield, title: "برامج متنوعة", desc: "برامج للناشئين من مختلف الأعمار" },
  { icon: Target, title: "تطوير شامل", desc: "تطوير المهارات البدنية والذهنية والتقنية" },
  { icon: Award, title: "نتائج مثبتة", desc: "سجل حافل من الإنجازات والبطولات" },
];

export default async function HomePage() {
  const [programs, coaches, news, gallery] = await Promise.all([
    getPrograms(3),
    getCoaches(4),
    getNews(3),
    getGalleryImages(6),
  ]);

  return (
    <>
      <HeroVideo />

      {/* About */}
      <SectionWrapper className="bg-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">من نحن</span>
              <h2 className="section-title mt-2">أكاديمية هولندا<br />للتميز الرياضي</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                أكاديمية هولندا هي وجهة الأبطال الصاعدين. نقدم برامج تدريبية متكاملة مصممة بعناية لصقل المواهب وتطوير مهارات اللاعبين في بيئة احترافية مشجعة تجمع بين الأسلوب الأوروبي وروح الكرة المحلية.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                نؤمن أن كل لاعب يحمل في داخله بطلاً ينتظر أن يُكتشف ويُصقل. رسالتنا هي توفير البيئة المثالية والكادر التدريبي المتميز لتحقيق ذلك.
              </p>
              <Link href="/programs" className="btn-primary">
                اكتشف برامجنا <ArrowLeft size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "500+", label: "لاعب مسجل" },
                { num: "50+", label: "مدرب متخصص" },
                { num: "10+", label: "سنوات خبرة" },
                { num: "30+", label: "بطولة محققة" },
              ].map((stat) => (
                <div key={stat.label} className="card p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.num}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Features */}
      <SectionWrapper className="bg-dark-100">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">لماذا تختارنا</span>
          <h2 className="section-title mt-2 text-center">ما يميّزنا عن الآخرين</h2>
          <p className="section-subtitle">نقدم تجربة تدريبية متكاملة تجمع بين الاحترافية والإبداع</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 text-right group hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Programs */}
      {programs.length > 0 && (
        <SectionWrapper className="bg-dark">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">برامجنا</span>
              <h2 className="section-title mt-2 text-center">برامج تدريبية متميزة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programs.map((program) => (
                <Link key={String(program._id)} href={`/programs/${program.slug}`} className="card group">
                  <div className="aspect-video bg-dark-200 relative overflow-hidden">
                    {program.mainImage ? (
                      <Image src={program.mainImage} alt={program.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">⚽</div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-primary text-xs font-medium bg-primary/10 px-2 py-1 rounded-full">{program.ageGroup}</span>
                    <h3 className="text-white font-semibold text-lg mt-3 mb-2">{program.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{program.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/programs" className="btn-outline">عرض جميع البرامج <ArrowLeft size={18} /></Link>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* Coaches */}
      {coaches.length > 0 && (
        <SectionWrapper className="bg-dark-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">فريقنا</span>
              <h2 className="section-title mt-2 text-center">كادرنا التدريبي</h2>
            </div>
            <CoachesGrid coaches={coaches} />
            <div className="text-center mt-10">
              <Link href="/coaches" className="btn-outline">عرض الكادر الكامل <ArrowLeft size={18} /></Link>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <SectionWrapper className="bg-dark">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">معرض الصور</span>
              <h2 className="section-title mt-2 text-center">لحظاتنا المضيئة</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map((img) => (
                <div key={String(img._id)} className="aspect-square relative overflow-hidden rounded-xl group">
                  <Image src={img.url} alt={img.caption || "صورة من المعرض"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/gallery" className="btn-outline">عرض المعرض كاملاً <ArrowLeft size={18} /></Link>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* News */}
      {news.length > 0 && (
        <SectionWrapper className="bg-dark-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">آخر الأخبار</span>
              <h2 className="section-title mt-2 text-center">أخبار الأكاديمية</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link key={String(item._id)} href={`/news/${item.slug}`} className="card group">
                  <div className="aspect-video bg-dark-200 relative overflow-hidden">
                    {item.featuredImage ? (
                      <Image src={item.featuredImage} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-gray-500 text-xs mb-2">{formatDate(String(item.publishDate))}</p>
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{item.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/news" className="btn-outline">جميع الأخبار <ArrowLeft size={18} /></Link>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* Registration CTA */}
      <SectionWrapper className="bg-gradient-to-br from-primary/20 via-dark to-dark">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            انضم إلى عائلة<br />
            <span className="text-primary">أكاديمية هولندا</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10">
            لا تفوّت الفرصة. سجّل طفلك الآن وابدأ رحلة النجاح معنا
          </p>
          <Link href="/registration" className="btn-primary text-lg px-10 py-4">
            سجّل الآن مجاناً ⚽
          </Link>
        </div>
      </SectionWrapper>
    </>
  );
}
