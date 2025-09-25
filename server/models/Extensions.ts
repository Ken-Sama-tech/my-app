import type { ExtensionSchema } from "./types/Extensions";
import mongoose from "mongoose";

const { Schema } = mongoose;

const extensionSchema = new Schema<ExtensionSchema>(
  {
    name: { type: String, required: true },
    logo_url: {
      type: String,
      default:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg",
    },
    extType: {
      type: String,
      enum: ["manga", "anime", "novel"],
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    ext_path: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
      required: true,
    },
  },
  { collection: "extensions" }
);

const Extension = mongoose.model<ExtensionSchema>("Extension", extensionSchema);
export { Extension, type ExtensionSchema };
