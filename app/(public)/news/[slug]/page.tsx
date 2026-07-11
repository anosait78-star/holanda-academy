export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  return { title: article?.title || "الخبر", description: article?.shortDescription || "" };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/news" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 text-sm">
          <ArrowRight size={16} /> العودة إلى الأخبار
        </Link>
        <p className="text-gray-500 text-sm mb-4">{formatDate(String(article.publishDate))}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{article.title}</h1>
        {article.featuredImage && (
          <div className="aspect-video relative rounded-2xl overflow-hidden mb-8">
            <Image src={article.featuredImage} alt={article.title} fill className="object-cover" />
          </div>
        )}
        {article.shortDescription && (
          <p className="text-lg text-gray-300 border-r-4 border-primary pr-4 mb-8 leading-relaxed">{article.shortDescription}</p>
        )}
        {article.fullContent && (
          <div className="text-gray-400 leading-relaxed whitespace-pre-line text-base">{article.fullContent}</div>
        )}
      </div>
    </div>
  );
}
