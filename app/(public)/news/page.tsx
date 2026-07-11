export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getNews } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "الأخبار" };

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">آخر الأخبار</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">أخبار الأكاديمية</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">تابع آخر مستجدات وأخبار أكاديمية هولندا</p>
        </div>

        {!news.length ? (
          <div className="text-center py-20 text-gray-500">لا توجد أخبار حالياً</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <Link key={String(item._id)} href={`/news/${item.slug}`} className="card group hover:-translate-y-1 transition-transform duration-300">
                <div className="aspect-video bg-dark-200 relative overflow-hidden">
                  {item.featuredImage ? (
                    <Image src={item.featuredImage} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📰</div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-gray-500 text-xs mb-3">{formatDate(String(item.publishDate))}</p>
                  <h2 className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h2>
                  <p className="text-gray-400 text-sm line-clamp-3">{item.shortDescription}</p>
                  <span className="text-primary text-sm mt-4 inline-block">اقرأ المزيد ←</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
