"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Category { _id: string; name: string; slug: string }
interface GalleryImg { _id: string; url: string; caption?: string; categoryId?: string }

export default function GalleryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<GalleryImg[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [catRes, imgRes] = await Promise.all([
        fetch("/api/gallery/categories").then((r) => r.json()),
        fetch("/api/gallery/images").then((r) => r.json()),
      ]);
      setCategories(Array.isArray(catRes) ? catRes : []);
      setImages(Array.isArray(imgRes) ? imgRes : []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = activeCategory === "all" ? images : images.filter((i) => i.categoryId === activeCategory);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">معرض الصور</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">لحظاتنا المضيئة</h1>
          <p className="text-gray-400 text-lg">أبرز اللحظات والذكريات من رحلتنا مع أبطالنا</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button onClick={() => setActiveCategory("all")} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === "all" ? "bg-primary text-white" : "bg-dark-200 text-gray-400 hover:text-white"}`}>
            الكل
          </button>
          {categories.map((cat) => (
            <button key={cat._id} onClick={() => setActiveCategory(cat._id)} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat._id ? "bg-primary text-white" : "bg-dark-200 text-gray-400 hover:text-white"}`}>
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-dark-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">لا توجد صور في هذا التصنيف</div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((img, idx) => (
              <div key={img._id} className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden group mb-3" onClick={() => setLightboxIndex(idx)}>
                <div className="relative">
                  <Image src={img.url} alt={img.caption || "صورة"} width={400} height={300} className="w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={filtered.map((img) => ({ src: img.url, alt: img.caption || "صورة" }))}
        />
      </div>
    </div>
  );
}
