import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  await connectDB();
  const news = await News.find({}).sort({ publishDate: -1 }).lean();
  return NextResponse.json(news);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    let base = slugify(body.title);
    if (!base) base = "news";
    let slug = base;
    let counter = 1;
    while (await News.exists({ slug })) {
      slug = `${base}-${counter++}`;
    }
    const article = await News.create({ ...body, slug });
    return NextResponse.json(article, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
