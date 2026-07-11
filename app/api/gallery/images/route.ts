import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";
import { getSession } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const images = await GalleryImage.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const image = await GalleryImage.create(body);
  return NextResponse.json(image, { status: 201 });
}
