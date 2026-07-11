import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryCategory extends Document {
  name: string;
  slug: string;
  createdAt: Date;
}

const GalleryCategorySchema = new Schema<IGalleryCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true }
);

const GalleryCategory: Model<IGalleryCategory> =
  mongoose.models.GalleryCategory ??
  mongoose.model<IGalleryCategory>("GalleryCategory", GalleryCategorySchema);

export default GalleryCategory;
