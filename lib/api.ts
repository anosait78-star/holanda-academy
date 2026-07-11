// Server-side data fetching — calls MongoDB directly via models
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import Program from "@/models/Program";
import Coach from "@/models/Coach";
import News from "@/models/News";
import GalleryImage from "@/models/GalleryImage";
import GalleryCategory from "@/models/GalleryCategory";
import Registration from "@/models/Registration";

export async function getSettings(): Promise<Record<string, string>> {
  try {
    await connectDB();
    const settings = await Settings.find({}).lean();
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    return map;
  } catch { return {}; }
}

export async function getPrograms(limit?: number) {
  await connectDB();
  const q = Program.find({}).sort({ createdAt: -1 });
  if (limit) q.limit(limit);
  return JSON.parse(JSON.stringify(await q.lean()));
}

export async function getProgramBySlug(slug: string) {
  await connectDB();
  return JSON.parse(JSON.stringify(await Program.findOne({ slug }).lean()));
}

export async function getCoaches(limit?: number) {
  await connectDB();
  const q = Coach.find({}).sort({ createdAt: 1 });
  if (limit) q.limit(limit);
  return JSON.parse(JSON.stringify(await q.lean()));
}

export async function getNews(limit?: number) {
  await connectDB();
  const q = News.find({}).sort({ publishDate: -1 });
  if (limit) q.limit(limit);
  return JSON.parse(JSON.stringify(await q.lean()));
}

export async function getNewsBySlug(slug: string) {
  await connectDB();
  return JSON.parse(JSON.stringify(await News.findOne({ slug }).lean()));
}

export async function getGalleryImages(limit?: number) {
  await connectDB();
  const q = GalleryImage.find({}).sort({ createdAt: -1 });
  if (limit) q.limit(limit);
  return JSON.parse(JSON.stringify(await q.lean()));
}

export async function getGalleryCategories() {
  await connectDB();
  return JSON.parse(JSON.stringify(await GalleryCategory.find({}).sort({ createdAt: 1 }).lean()));
}

export async function getRegistrationCount() {
  await connectDB();
  return Registration.countDocuments();
}

export async function getLatestRegistrations(limit = 10) {
  await connectDB();
  const docs = await Registration.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  return JSON.parse(JSON.stringify(docs));
}

export async function getStats() {
  await connectDB();
  const [programs, coaches, news, registrations] = await Promise.all([
    Program.countDocuments(),
    Coach.countDocuments(),
    News.countDocuments(),
    Registration.countDocuments(),
  ]);
  return { programs, coaches, news, registrations };
}
