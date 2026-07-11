import mongoose, { Schema, Document, Model } from "mongoose";

export interface INews extends Document {
  title: string;
  slug: string;
  shortDescription?: string;
  fullContent?: string;
  featuredImage?: string;
  featuredImagePublicId?: string;
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    shortDescription: { type: String },
    fullContent: { type: String },
    featuredImage: { type: String },
    featuredImagePublicId: { type: String },
    publishDate: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

NewsSchema.index({ publishDate: -1 });

const News: Model<INews> =
  mongoose.models.News ?? mongoose.model<INews>("News", NewsSchema);

export default News;
