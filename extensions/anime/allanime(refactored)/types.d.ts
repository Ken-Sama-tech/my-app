import getEpisode from "../../../server/utils/animeExtension/getEpisode";

type AllowAdult = boolean;

type AllowUnknown = boolean;

type Query = string;

type TranslationType = "sub" | "dub";

type ShowId = string;

type PerPage = number;

type Page = number;

type EpisodeString = string;

type CountryOrigin = "ALL";

type AvailableEpisodes = {
  sub: number;
  dub: number;
  raw: number;
};

type SearchReponseFields = {
  _id: string;
  thumbnail?: string;
  altNames?: string[];
  name: string;
  availableEpisodes?: AvailableEpisodes;
  __typename: string;
  malId: string;
};

type Source = {
  sourceUrl: string;
  readonly priority: number;
  readonly sourceName: string;
  readonly type: "iframe" | "player";
  readonly className: string;
  readonly streamerId: string;
  readonly sandbox?: string;
};

export type Variables = {
  translationType: TranslationType;
  showId?: ShowId;
  limit?: PerPage;
  page?: Page;
  episodeString?: EpisodeString;
  countryOrigin?: CountryOrigin;
};

export type SearhVariables = Variables & {
  search: {
    allowAdult: AllowAdult;
    allowUnknown: AllowUnknown;
    query: Query;
  };
};

export type GetEpisodeLinkVariables = {
  showId: string;
  translationType: TranslationType;
  episodeString: string;
};

export type SearchResponse = {
  readonly data: {
    readonly shows: {
      readonly edges: SearchReponseFields[];
    };
  };
};

export type GetEpisodeLinkResponse = {
  readonly data: {
    readonly episode: {
      readonly episodeString: string;
      readonly sourceUrls: Source[];
    };
  };
};
