import type {
  AnimeExtensions,
  Id,
  Translation,
  Languages,
} from "../../../../shared-types/extensions/anime";
import type {
  SearchAnimeResBody,
  GetEpisodeListResBody,
  GetEpisodeResBody,
  GetTranslationsResBody,
} from "../../../../shared-types/controllers/animeExtensions";

export type FetchAnimeArgs = {
  extensions: AnimeExtensions[];
  title: string;
  idMal?: number;
};

export type FetchAnimeResponse = {
  -readonly [K in keyof SearchAnimeResBody]: SearchAnimeResBody[K];
};

export type FetchEpisodeListArgs = {
  extension?: AnimeExtensions;
  id: Id;
  translation?: Translation;
  lang?: Languages;
};

export type FetchEpisodeListResponse = {
  -readonly [K in keyof GetEpisodeListResBody]: GetEpisodeListResBody[K];
};

export type FetchTranslationsArgs = {
  id: Id;
  extension?: AnimeExtensions;
};

export type FetchTranslationsResponse = {
  -readonly [K in keyof GetTranslationsResBody]: GetTranslationsResBody[K];
};

export type FetchEpisodeArgs = {
  extension?: AnimeExtensions;
  id: Id;
  translation?: Translation;
  episode?: number;
};

export type FetchEpisodeResponse = {
  -readonly [K in keyof GetEpisodeResBody]: GetEpisodeResBody[K];
};
