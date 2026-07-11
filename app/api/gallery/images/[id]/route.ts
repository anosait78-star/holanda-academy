import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";
import { getSession } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

interface Params { params: Promise<{ id: string }> }

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const image = await GalleryImage.findByIdAndDelete(id);
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteFromCloudinary(image.publicId).catch(() => {});

  return NextResponse.json({ success: true });
}
