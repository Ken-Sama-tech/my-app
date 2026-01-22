export type Title = {
  romaji?: string;
  english?: string;
  native?: string;
};

export type CoverImage = {
  extraLarge?: string;
};

export type MediaFields = {
  readonly id: number;
  readonly idMal: number;
  readonly title: Title;
  readonly description?: string;
  readonly coverImage?: CoverImage;
  readonly meanScore?: number;
  readonly status?: string;
  readonly genres?: string[];
  readonly tags?: {
    readonly id?: number;
    readonly name?: string;
    readonly description?: string;
  }[];
  readonly format?: string;
  readonly bannerImage?: string;
  readonly updatedAt?: number;
  readonly episodes?: number;
  readonly duration?: number;
  readonly nextAiringEpisode?: {
    readonly airingAt?: number;
    readonly episode?: number;
    readonly timeUntilAiring?: number;
  };
};

export type AnilistMediaQueryResponse = {
  Media: MediaFields;
};

export type AnilistPageQueryResponse = {
  Page: {
    media: MediaFields[];
  };
};
