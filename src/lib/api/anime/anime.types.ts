import type {
  Id,
  Translation,
  Languages,
  ValidExtensionId,
} from "../../../../shared-types/extensions/";
import type {
  SearchAnimeResBody,
  GetEpisodeListResBody,
  GetEpisodeResBody,
  GetTranslationsResBody,
} from "../../../../shared-types/controllers/animeExtensions";

export type FetchAnimeArgs = {
  extensions: ValidExtensionId[];
  title: string;
  idMal?: number;
};

export type FetchAnimeResponse = SearchAnimeResBody;

export type FetchEpisodeListArgs = {
  extension?: ValidExtensionId;
  id: Id;
  translation?: Translation;
  lang?: Languages;
};

export type FetchEpisodeListResponse = GetEpisodeListResBody;

export type FetchTranslationsArgs = {
  id: Id;
  extension?: ValidExtensionId;
};

export type FetchTranslationsResponse = GetTranslationsResBody;

export type FetchEpisodeArgs = {
  extension?: ValidExtensionId;
  id: Id;
  translation?: Translation;
  episode?: number;
};

export type FetchEpisodeResponse = GetEpisodeResBody;
