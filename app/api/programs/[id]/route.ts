import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Program from "@/models/Program";
import { getSession } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { slugify } from "@/lib/utils";

interface Params { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const program = await Program.findById(id).lean();
  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(program);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const body = await req.json();
  if (body.title) body.slug = slugify(body.title);

  const program = await Program.findByIdAndUpdate(id, body, { new: true });
  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(program);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const program = await Program.findByIdAndDelete(id);
  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Clean up Cloudinary images
  if (program.mainImagePublicId) await deleteFromCloudinary(program.mainImagePublicId).catch(() => {});
  for (const img of program.galleryImages) {
    await deleteFromCloudinary(img.publicId).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
