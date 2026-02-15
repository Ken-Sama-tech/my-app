import axios, { type AxiosResponse } from "axios";

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
  data?: T;
  error: boolean;
  message: string;
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
    "Thriller",
  ];
};

const anilist = () => {
  const api: string = "https://graphql.anilist.co";

  return {
    query: async <TData = null, TVars = null>(
      gql: string,
      variables: TVars | object,
    ): Promise<ResponseData<TData>> => {
      try {
        const res = await axios.post<AxiosResponse<TData>>(api, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          query: gql,
          variables,
        });

        const { data } = res.data;

        return {
          data,
          error: false,
          message: "success",
        };
      } catch (error: any) {
        const eMessage: any = error?.response?.data?.errors;
        return {
          error: true,
          message: eMessage || error.message || error,
        };
      }
    },

    media: <T>(
      args: MediaArgs,
      data: string[],
      isPaginated: boolean = false,
    ): MediaResponse<T> => {
      const {
        search = "",
        type = "ANIME",
        id = null,
        idMal = null,
        sort = null,
        isAdult = false,
      } = args;

      const queryArgs: string[] = [];
      const variables: MediaArgs = {
        type: type,
      };

      queryArgs.push("$type: MediaType");

      if (search) {
        queryArgs.push("$search: String");
        variables["search"] = search;
      }
      if (isAdult) {
        queryArgs.push("$isAdult: Boolean");
        variables["isAdult"] = isAdult;
      }
      if (id) {
        queryArgs.push("$id: Int");
        variables["id"] = id;
      }
      if (idMal) {
        queryArgs.push("$idMal: Int");
        variables["idMal"] = idMal;
      }
      if (sort) {
        queryArgs.push("$sort: [MediaSort]");
        variables["sort"] = sort;
      }

      const self = anilist();

      const start = isPaginated ? "media" : "Media";

      const q = (s: string) =>
        `query(${queryArgs.map((q) => " " + q)}) { ${s}} `;

      const mediaQuery: string = `${start} (${queryArgs.map((q) => {
        const start = q.indexOf("$") + 1;
        const end = q.indexOf(":");
        const key = q.slice(start, end);
        const value = q.slice(0, end);
        return ` ${key}: ${value}`;
      })}) {${data.map((q) => " " + q)} }`;

      const gql = q(mediaQuery);

      return {
        mediaQuery: mediaQuery,
        gql: gql,
        queryArgs,
        variables,
        query: async () => {
          const res = await self.query<T, MediaArgs>(gql, variables);
          return res;
        },
      };
    },

    page: <T>({
      page = 1,
      perPage = 10,
      pageInfo = false,
    }: PageArgs & { pageInfo?: boolean }): PageResponse<T> => {
      const self = anilist();

      const includePageInfo = pageInfo
        ? `pageInfo { currentPage hasNextPage lastPage perPage total } `
        : "";

      const q = (mediaQuery: string, queryArgs: string[]) =>
        `query($page: Int, $perPage: Int,${queryArgs.map(
          (a) => " " + a,
        )} ) { Page(page: $page, perPage: $perPage) { ${mediaQuery} ${includePageInfo}} }`;

      return {
        media: (args: MediaArgs, data: string[]): MediaResponse<T> => {
          const res = self.media(args, data, true);
          const { variables, mediaQuery, queryArgs } = res;
          const gql = q(mediaQuery, queryArgs);

          return {
            query: async (): Promise<ResponseData<T>> => {
              const res = await self.query<T, MediaArgs & PageArgs>(gql, {
                ...variables,
                page,
                perPage,
              });

              return res;
            },
            gql,
            mediaQuery,
            queryArgs,
            variables,
          };
        },
      };
    },

    // genres: async (): Promise<ResponseData<GetGenresResponse>> => {
    //   const self = anilist();
    //   const genres = await self.query<GetGenresResponse, null>(
    //     `query{ GenreCollection }`,
    //     null,
    //   );

    //   const { data, error, message } = genres;

    //   if (error) {
    //     return {
    //       data,
    //       error,
    //       message,
    //     };
    //   }

    //   return {
    //     data,
    //     message,
    //     error,
    //   };
    // },
  };
};

export default anilist;
