import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Program from "@/models/Program";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  await connectDB();
  const programs = await Program.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(programs);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    let base = slugify(body.title);
    if (!base) base = "program";
    let slug = base;
    let counter = 1;
    while (await Program.exists({ slug })) {
      slug = `${base}-${counter++}`;
    }
    const program = await Program.create({ ...body, slug });
    return NextResponse.json(program, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
