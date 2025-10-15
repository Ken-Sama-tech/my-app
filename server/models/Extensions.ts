import mongoose from "mongoose";
import { ExtensionsSchema } from "./types/Extensions";

const extensionsSchema = new mongoose.Schema<ExtensionsSchema>({
  name: {
    type: String,
    required: true,
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

const Extensions = mongoose.model<ExtensionsSchema>(
  "Extension",
  extensionsSchema
);

export default Extensions;
