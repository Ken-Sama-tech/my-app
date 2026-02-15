import type {
  AnimeExtensions,
  MalId,
  Id,
  Sub,
  Dub,
  Source,
  Languages,
  Translation,
  EpisodeList,
} from "../../../shared-types/extensions/anime";

export type SearchResponseMetaData = {
  readonly title: string;
  readonly alternatives: string[];
  readonly malId: MalId;
  readonly id: Id;
  // episodes: Episodes;
  // readonly alternatives: string[];
  // readonly tags: string[];
  // readonly genres: string[];
  // readonly thumbnail: string;
  // readonly thumbnails: string[];
};

// type SearchResponseInfo = {
//   extension: Extensions;
//   perPage: PerPage;
//   page: Page;
//   hasNextPage: HasNextPage;
//   lastPage?: LastPage;
// };

type Error = boolean;

type Status = number;

type Message = string;

// type HasNextPage = boolean;

// type Page = Number;

// type PerPage = Number;

// type LastPage = number;

type Response<D> = {
  readonly payload?: D;
  readonly error: Error;
  readonly status: Status;
  readonly message: Message;
};

export type SearchResponse = Response<{
  results?: SearchResponseMetaData[];
  extension: AnimeExtensions;
  // info: SearchResponseInfo;
}>;

export type Search = (query: string) => Promise<SearchResponse>;

export type GetTranslationsResponse = Response<{
  extension: AnimeExtensions;
  subs?: Sub[];
  dubs?: Dub[];
}>;

export type GetTranslations = (id: Id) => Promise<GetTranslationsResponse>;

type GetEpisodeListArgs = {
  translation?: Translation;
  lang?: Languages;
};

export type GetEpisodeListResponse = Response<{
  extension: AnimeExtensions;
  id: Id;
  language: Languages;
  translation: Translation;
  episodeList: EpisodeList[];
}>;

export type GetEpisodeList = (
  id: Id,
  args?: GetEpisodeListArgs,
) => Promise<GetEpisodeListResponse>;

type GetEpisodeLinkArgs = {
  translation?: Translation;
  episode?: number;
};

export type GetEpisodeLinkResponse = Response<{
  sources: Source[];
  episode: number;
  referrer: string;
  episodeTitle: string;
  lang: Languages;
  translation: Translation;
  extension: AnimeExtensions;
}>;

export type GetEpisodeLink = (
  id: string,
  args?: GetEpisodeLinkArgs,
) => Promise<GetEpisodeLinkResponse>;

export type Base = () => {
  extension: AnimeExtensions;
  referrer: string;
  search: Search;
  getEpisodeList: GetEpisodeList;
  getTranslations: GetTranslations;
  getEpisodeLink: GetEpisodeLink;
};
