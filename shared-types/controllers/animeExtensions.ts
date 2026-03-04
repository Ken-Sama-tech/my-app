import type { ObjectId } from "mongoose";
import type {
  Languages,
  Id,
  Sub,
  Dub,
  EpisodeList,
  Translation,
  Source,
  ValidExtensionId,
  AnimeExtensions,
} from "../extensions";

type Response<T, E = null> =
  | {
      data: T;
      error: false;
      message: string;
      status: number;
    }
  | {
      data: E;
      error: true;
      message: string;
      status: number;
    };

export type SearchAnimeResBody = Response<
  {
    name: AnimeExtensions;
    extensionId: ValidExtensionId | ObjectId;
    result: {
      title: string;
      malId: number;
      id: Id;
    };
  },
  {
    extensionId: ValidExtensionId | ObjectId;
  }
>;

export type GetTranslationsResBody = Response<
  {
    name: AnimeExtensions;
    extensionId: ValidExtensionId | ObjectId;
    subs: Sub[];
    dubs: Dub[];
  },
  {
    extensionId: ValidExtensionId | ObjectId;
  }
>;

export type GetEpisodeListResBody = Response<
  {
    name: AnimeExtensions;
    extensionId: ValidExtensionId | ObjectId;
    id: Id;
    language: Languages;
    translation: Translation;
    episodeList: EpisodeList[];
  },
  {
    extensionId: ValidExtensionId | ObjectId;
  }
>;

export type GetEpisodeResBody = Response<
  {
    sources: Source[];
    episode: number;
    episodeTitle?: string;
    lang: Languages;
    translation: Translation;
    name: AnimeExtensions;
    extensionId: ValidExtensionId | ObjectId;
    referrer: string;
  },
  {
    extensionId: ValidExtensionId | ObjectId;
  }
>;
