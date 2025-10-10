import mongoose from "mongoose";
import { ExtensionsSchema } from "./types/Extensions";

const extensionsSchema = new mongoose.Schema<ExtensionsSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    logo_url: {
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
  },
  { collection: "extensions" }
);

const Extensions = mongoose.model<ExtensionsSchema>(
  "extensions",
  extensionsSchema
);

export default Extensions;
