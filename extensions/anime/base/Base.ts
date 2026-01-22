import type {
  Extensions,
  MalId,
  Id,
  Episodes,
  Source,
  Languages,
  Translation,
} from "../../../shared-types/extensions/anime";

export type SearchResponseMetaData = {
  readonly title: string;
  readonly alternatives: string[];
  readonly malId: MalId;
  readonly id: Id;
  episodes: Episodes;
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
  extension: Extensions;
  // info: SearchResponseInfo;
}>;

export type GetEpisodeLinkResponse = Response<{
  sources: Source[];
  episode: number;
  lang: Languages;
  translation: Translation;
  extension: Extensions;
}>;

export type Search = (query: string) => Promise<SearchResponse>;

type GetEpisodeLinkArguments = {
  translation?: Translation;
  episode?: number;
};

export type GetEpisodeLink = (
  id: string,
  args?: GetEpisodeLinkArguments,
) => Promise<GetEpisodeLinkResponse>;

export type Base = () => {
  extension: Extensions;
  referrer: string;
  search: Search;
  getEpisodeLink: GetEpisodeLink;
};
