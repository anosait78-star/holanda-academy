import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coach from "@/models/Coach";
import { getSession } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const coach = await Coach.findByIdAndUpdate(id, body, { new: true });
  if (!coach) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(coach);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const coach = await Coach.findByIdAndDelete(id);
  if (!coach) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (coach.photoPublicId) await deleteFromCloudinary(coach.photoPublicId).catch(() => {});

  return NextResponse.json({ success: true });
}
