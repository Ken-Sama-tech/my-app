import mongoose from "mongoose";
import { ExtensionsSchema } from "./types/Extensions";

const extensionsSchema = new mongoose.Schema<ExtensionsSchema>({
  name: {
    type: String,
    required: true,
    index: true,
  },
  logo: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ["anime", "manga", "novel"],
  },
});

extensionsSchema.index({ type: 1, active: 1, name: -1 });

const Extensions = mongoose.model<ExtensionsSchema>(
  "Extension",
  extensionsSchema
);

export default Extensions;
