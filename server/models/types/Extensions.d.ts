import type { ObjectId } from "mongoose";

export type ExtensionTypes = "anime" | "manga" | "novel";

export type ExtensionsSchema = {
  name: string;
  logo: string;
  source: string;
  active: boolean;
  type: ExtensionTypes;
};

export type AnimeExtensions = "allanime" | "Hentai Haven";

export type ExtensionsResponse = {
  readonly _id: ObjectId;
  readonly name: AnimeExtensions;
  readonly source: string;
  readonly logo: string;
  readonly active: boolean;
  readonly type: ExtensionTypes;
};
