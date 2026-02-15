import type {
  AnimeExtensions,
  Languages,
  Id,
  Sub,
  Dub,
  EpisodeList,
  Translation,
  Source,
} from "../extensions";

type Response<T> = {
  data: T | null;
  error: boolean;
  message: string;
  status: number;
};

export type SearchAnimeResBody = Response<{
  extension: AnimeExtensions;
  result?: {
    title: string;
    malId: number;
    id: Id;
  };
}>;

export type GetTranslationsResBody = Response<{
  extension: AnimeExtensions;
  subs?: Sub[];
  dubs?: Dub[];
}>;

export type GetEpisodeListResBody = Response<{
  extension: AnimeExtensions;
  id?: Id;
  language?: Languages;
  translation?: Translation;
  episodeList?: EpisodeList[];
}>;

export type GetEpisodeResBody = Response<{
  sources?: Source[];
  episode?: number;
  episodeTitle?: string;
  lang?: Languages;
  translation?: Translation;
  extension: AnimeExtensions;
  referrer: string;
}>;
