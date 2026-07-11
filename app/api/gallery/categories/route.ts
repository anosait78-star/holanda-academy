import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GalleryCategory from "@/models/GalleryCategory";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  await connectDB();
  const cats = await GalleryCategory.find({}).sort({ createdAt: 1 }).lean();
  return NextResponse.json(cats);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { name } = await req.json();
  const cat = await GalleryCategory.create({ name, slug: slugify(name) });
  return NextResponse.json(cat, { status: 201 });
}
