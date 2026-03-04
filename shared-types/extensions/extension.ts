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

const validExtensionIdList = [
  "699a693514082cb82a291c71",
  "699a69a314082cb82a291c72",
] as const;

export type ValidExtensionId = (typeof validExtensionIdList)[number];
