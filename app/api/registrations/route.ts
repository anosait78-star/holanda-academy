import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const registrations = await Registration.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(registrations);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const reg = await Registration.create(body);
    return NextResponse.json(reg, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
