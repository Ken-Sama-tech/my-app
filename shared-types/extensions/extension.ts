import type { AnimeExtensions } from "./anime";
import type { ObjectId } from "mongoose";

export type ExtensionTypes = "anime" | "manga" | "novel";

export type ExtensionsSchema = {
  name: AnimeExtensions;
  logo: string;
  source: string;
  active: boolean;
  type: ExtensionTypes;
  _id: ObjectId;
};
