import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoach extends Document {
  name: string;
  position: string;
  experience?: string;
  biography?: string;
  photo?: string;
  photoPublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CoachSchema = new Schema<ICoach>(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true },
    experience: { type: String },
    biography: { type: String },
    photo: { type: String },
    photoPublicId: { type: String },
  },
  { timestamps: true }
);

const Coach: Model<ICoach> =
  mongoose.models.Coach ?? mongoose.model<ICoach>("Coach", CoachSchema);

export default Coach;
