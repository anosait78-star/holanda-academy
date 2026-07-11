import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coach from "@/models/Coach";
import { getSession } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const coaches = await Coach.find({}).sort({ createdAt: 1 }).lean();
  return NextResponse.json(coaches);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    const coach = await Coach.create(body);
    return NextResponse.json(coach, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
