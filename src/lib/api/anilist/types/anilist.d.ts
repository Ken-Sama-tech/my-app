//unused for now atleast

export type MediaType = "MANGA" | "ANIME";

export type MediaSort =
  | "ID"
  | "ID_DESC"
  | "TITLE_ROMAJI"
  | "TITLE_ROMAJI_DESC"
  | "TITLE_ENGLISH"
  | "TITLE_ENGLISH_DESC"
  | "TITLE_NATIVE"
  | "TITLE_NATIVE_DESC"
  | "TYPE"
  | "TYPE_DESC"
  | "FORMAT"
  | "FORMAT_DESC"
  | "START_DATE"
  | "START_DATE_DESC"
  | "END_DATE"
  | "END_DATE_DESC"
  | "SCORE"
  | "SCORE_DESC"
  | "POPULARITY"
  | "POPULARITY_DESC"
  | "TRENDING"
  | "TRENDING_DESC"
  | "EPISODES"
  | "EPISODES_DESC"
  | "DURATION"
  | "DURATION_DESC"
  | "STATUS"
  | "STATUS_DESC"
  | "CHAPTERS"
  | "CHAPTERS_DESC"
  | "VOLUMES"
  | "VOLUMES_DESC"
  | "UPDATED_AT"
  | "UPDATED_AT_DESC"
  | "SEARCH_MATCH"
  | "FAVOURITES"
  | "FAVOURITES_DESC";

export type MediaArgs = {
  search?: string | "";
  id?: number | null;
  idMal?: number;
  type?: MediaType;
  sort?: MediaSort | MediaSort[] | null;
  isAdult?: boolean;
};

export type ResponseData<T> = {
  data?: T | null;
  error?: boolean;
  message?: string;
};

export type PageInfo = {
  currentPage: number;
  hasNextPage: boolean;
  lastPage: number;
  perPage: number;
  total: number;
};

export type PageArgs = {
  page?: number;
  perPage?: number;
};

export type MediaResponse<T> = {
  gql: string;
  mediaQuery: string;
  variables: MediaArgs;
  queryArgs: string[];
  query: () => Promise<ResponseData<T>>;
};

export type PageResponse<T> = {
  media: (args: MediaArgs, data: string[]) => MediaResponse<T>;
};

export type Genres = {
  GenreCollection: [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Ecchi",
    "Fantasy",
    "Hentai",
    "Horror",
    "Mahou Shoujo",
    "Mecha",
    "Music",
    "Mystery",
    "Psychological",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller"
  ];
};
