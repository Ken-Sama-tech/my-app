import { AnimeExtensions } from "../../../server/models/types/Extensions";

export type TranslationType = "sub" | "dub";

export type Variables = {
  translationType: TranslationType;
  showId?: string;
  episodeString?: string;
  limit?: number;
  query?: string;
  page?: number;
  countryOrigin?: "ALL";
};

export type AvailableEpisodes = {
  sub: number;
  dub: number;
  raw: number;
};

export type SearchResponseData = {
  _id: string;
  thumbnail?: string;
  name?: string;
  availableEpisodes?: AvailableEpisodes;
  __typename: "Show";
  malId: string;
}[];

export type AllAnimeSearchResponse = {
  readonly data?: {
    readonly shows: {
      readonly edges: SearchResponseData;
    };
  };
};

export type AllAnimeHeaders = {
  Referer: "https://allmanga.to";
  "User-Agent"?: string;
};

export type AllAnimeResponse<T> = {
  readonly data?: T | null;
  readonly status: number;
  readonly message: string;
  readonly error?: boolean;
};

export type AllAnimeSearchVariables = Variables & {
  search: {
    allowAdult: boolean;
    allowUnknown: boolean;
    query: string;
  };
};

export type GetSourceURLResponseData = {
  readonly episodeString: string;
  readonly sourceUrls: {
    readonly sourceUrl: string;
    readonly priority: number;
    readonly sourceName: string;
    readonly type: "iframe" | "player";
    readonly className?: string;
    readonly streamId?: string;
    readonly downloads?: {
      readonly sourceName: string;
      readonly downloadUrl: string;
    };
  }[];
};

export type GetSourceURLResponse = {
  readonly data: {
    readonly episode: GetSourceURLResponseData;
  };
};

export type Anime = (
  title: string,
  idMal: number
) => Promise<{
  hasEntry: boolean;
  entry?: SearchResponseData[0];
}>;

export type LoadAnimeResponse = {
  readonly sub: number;
  readonly type: "player" | "player";
  readonly dub: number;
  readonly loadEpisode: LoadEpisode;
  readonly showId: string;
  readonly malId: number | string;
  readonly name: string;
  readonly headers: {
    Referer: string;
  };
};

export type LoadAnime = (
  title: string,
  idMal: number
) => Promise<LoadAnimeResponse>;

export type LoadEpisodeResponse = {
  readonly currentEpisode: number;
  readonly translationType: TranslationType;
  readonly url: string;
  readonly html: string;
};

export type LoadEpisode = (
  episode?: number,
  translationType?: TranslationType
) => Promise<LoadEpisodeResponse>;

export type AllAnimeExtension = () => {
  readonly loadAnime: LoadAnime;
  readonly anime: Anime;
  readonly name: AnimeExtensions;
};
