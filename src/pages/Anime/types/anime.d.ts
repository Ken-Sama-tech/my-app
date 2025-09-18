export type Title = {
  romaji?: string;
  english?: string;
  native?: string;
};

export type CoverImage = {
  extraLarge?: string;
};

export type MediaFields = {
  id: number;
  idMal: number;
  title: Title;
  description?: string;
  coverImage?: CoverImage;
  meanScore?: number;
  status?: string;
  genres?: string[];
  format?: string;
  bannerImage?: string;
  updatedAt?: number;
  episodes?: number;
  duration?: number;
  nextAiringEpisode?: {
    airingAt?: number;
    episode?: number;
    timeUntilAiring?: number;
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
