import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.find({});
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    return NextResponse.json(map);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();

    for (const [key, value] of Object.entries(body)) {
      await Settings.findOneAndUpdate(
        { key },
        { key, value: String(value) },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
