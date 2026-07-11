import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  key: string;
  value: string;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: String, default: "" },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings ?? mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
