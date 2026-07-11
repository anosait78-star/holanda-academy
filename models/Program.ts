import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProgram extends Document {
  title: string;
  slug: string;
  ageGroup: string;
  shortDescription: string;
  fullDescription?: string;
  mainImage?: string;
  mainImagePublicId?: string;
  galleryImages: { url: string; publicId: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    ageGroup: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String },
    mainImage: { type: String },
    mainImagePublicId: { type: String },
    galleryImages: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Program: Model<IProgram> =
  mongoose.models.Program ?? mongoose.model<IProgram>("Program", ProgramSchema);

export default Program;
