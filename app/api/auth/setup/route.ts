import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Settings from "@/models/Settings";

// One-time setup endpoint — creates the first admin and default settings
// Disable or delete after first use
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const existing = await Admin.countDocuments();
    if (existing > 0) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await Admin.create({ email, password, role: "superadmin" });

    // Seed default settings
    const defaults = [
      { key: "academy_name", value: "أكاديمية هولندا" },
      { key: "whatsapp", value: "966500000000" },
      { key: "email", value: "info@holanda-academy.com" },
      { key: "address", value: "المملكة العربية السعودية" },
      { key: "footer_text", value: "نصنع أبطال المستقبل من خلال برامج تدريبية احترافية." },
      { key: "google_map_url", value: "" },
      { key: "instagram", value: "" },
      { key: "facebook", value: "" },
      { key: "twitter", value: "" },
      { key: "youtube", value: "" },
    ];

    for (const s of defaults) {
      await Settings.findOneAndUpdate({ key: s.key }, s, { upsert: true });
    }

    return NextResponse.json({ success: true, message: "Admin created and settings seeded" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
