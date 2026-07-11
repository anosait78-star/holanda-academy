import { MetadataRoute } from "next";
import { getPrograms, getNews } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://holanda-academy.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/programs`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/coaches`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/news`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/registration`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.7 },
  ];

  try {
    const [programs, news] = await Promise.all([getPrograms(), getNews()]);

    const programPages: MetadataRoute.Sitemap = programs.map((p) => ({
      url: `${baseUrl}/programs/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      priority: 0.8,
    }));

    const newsPages: MetadataRoute.Sitemap = news.map((n) => ({
      url: `${baseUrl}/news/${n.slug}`,
      lastModified: new Date(n.updatedAt),
      priority: 0.7,
    }));

    return [...staticPages, ...programPages, ...newsPages];
  } catch {
    return staticPages;
  }
}
