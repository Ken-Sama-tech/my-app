import { Schema, model } from "mongoose";
import type { ExtensionsSchema } from "../../shared-types/extensions";

const extensionsSchema = new Schema<ExtensionsSchema>({
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

const Extensions = model<ExtensionsSchema>("Extension", extensionsSchema);

export default Extensions;
