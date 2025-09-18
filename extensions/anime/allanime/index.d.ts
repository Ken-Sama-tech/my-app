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
  data?: {
    shows: {
      edges: SearchResponseData;
    };
  };
};

export type AllAnimeHeaders = {
  Referer: "https://allmanga.to";
  "User-Agent"?: string;
};

export type AllAnimeResponse<T> = {
  data?: T | null;
  status: number;
  message: string;
  error?: boolean;
};

export type AllAnimeSearchVariables = Variables & {
  search: {
    allowAdult: boolean;
    allowUnknown: boolean;
    query: string;
  };
};

export type GetSourceURLResponseData = {
  episodeString: string;
  sourceUrls: {
    sourceUrl: string;
    priority: number;
    sourceName: string;
    type: "iframe" | "player";
    className?: string;
    streamId?: string;
    downloads?: {
      sourceName: string;
      downloadUrl: string;
    };
  }[];
};

export type GetSourceURLResponse = {
  data: {
    episode: GetSourceURLResponseData;
  };
};

export type Entry = {
  hasEntry: boolean;
  entry?: SearchResponseData[0];
};

export type LoadEntry = {
  sub: number;
  type: "player" | "player";
  dub: number;
  loadEpisode: (
    episode?: number,
    translationType?: TranslationType
  ) => Promise<LoadEpisode>;
  showId: string;
  malId: number | string;
  name: string;
  headers: AllAnimeHeaders;
};

export type LoadEpisode = {
  currentEpisode: number;
  translationType: TranslationType;
  url: string;
  html: string;
};
