import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryImage extends Document {
  url: string;
  publicId: string;
  caption?: string;
  categoryId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: "GalleryCategory", default: null },
  },
  { timestamps: true }
);

GalleryImageSchema.index({ categoryId: 1 });
GalleryImageSchema.index({ createdAt: -1 });

const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage ??
  mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);

export default GalleryImage;
