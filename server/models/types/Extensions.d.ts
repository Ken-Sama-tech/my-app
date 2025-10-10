import type { ObjectId } from "mongoose";

export type AnimeExtensions = "allanime";

export type ExtensionsSchema = {
  name: string;
  logo_url: string;
  source: string;
  active: boolean;
};

export type AnimeExtensionsResponse = {
  readonly _id: ObjectId;
  readonly name: AnimeExtensions;
  readonly source: string;
  readonly logo_url: string;
  readonly active: boolean;
};
