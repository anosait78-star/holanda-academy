import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import { getSession } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { slugify } from "@/lib/utils";

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const body = await req.json();
  if (body.title) body.slug = slugify(body.title);

  const article = await News.findByIdAndUpdate(id, body, { new: true });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const article = await News.findByIdAndDelete(id);
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (article.featuredImagePublicId) {
    await deleteFromCloudinary(article.featuredImagePublicId).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
