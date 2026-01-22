import type {
  Extensions,
  Id,
  MalId,
  Episodes,
} from "../../../../../shared-types/extensions/anime";

type Response<T> = {
  data: T;
  error: boolean;
  message: string;
  status: number;
};

export type FetchAnimeArguments = {
  extension: Extensions;
  title: string;
  idMal?: number;
};

export type FetchAnimeResponse = Response<{
  extension: Extensions;
  result?: {
    id: Id;
    malId: MalId;
    title: string;
    episodes: Episodes;
  };
}>;

export type { SearchResponse };
