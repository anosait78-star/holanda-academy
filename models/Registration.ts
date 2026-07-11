import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRegistration extends Document {
  playerName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  notes?: string;
  createdAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    playerName: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    dateOfBirth: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

RegistrationSchema.index({ createdAt: -1 });

const Registration: Model<IRegistration> =
  mongoose.models.Registration ??
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
