import axios, { type AxiosResponse } from "axios";
import getHostName from "../../utils/getHostName";

/**
 * The hell, I regret ever structuring this API this way.
 * Damnation, I'm also too lazy to rebuild this.
 * Non of these are making any sense bruhh.
 * Well this is the first API I built while literally learning typescript,
 * but that is not an excuse why a code should be this ugly.
 * Well if it's future me bear with it LOL.
 * You deserved it for not learning typescript before starting!!
 * You only think of revising this after you wrote thousands of code that involves this.
 * Making a change now might ruin the current code.
 */

export type MediaType = "MANGA" | "ANIME";

export type MediaSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export type MediaFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC"
  | "MANGA"
  | "NOVEL"
  | "ONE_SHOT";

export type RelationType =
  | "ADAPTATION"
  | "PREQUEL"
  | "SEQUEL"
  | "PARENT"
  | "SIDE_STORY"
  | "CHARACTER"
  | "SUMMARY"
  | "ALTERNATIVE"
  | "SPIN_OF"
  | "OTHER"
  | "SOURCE"
  | "COMPILATION"
  | "CONTAINS";

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

type MediaRelationBase = {
  format: MediaFormat;
  id: number;
  type: MediaType;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  season: MediaSeason | null;
  seasonYear: number | null;
};

type RelationEdges = {
  relationType: RelationType;
  node: MediaRelationBase;
};

type Relations = {
  edges: RelationEdges[];
};

type MediaRelations = {
  Media: {
    nextAiringEpisode: {
      airingAt: number;
    };

    relations: Relations;
  } & MediaRelationBase;
};

type GetFullSeasonChainFilter = {
  format?: MediaFormat[];
  relationType?: RelationType[];
  type?: MediaType;
};

type ResponseData<T = null> =
  | {
      data: T;
      error: false;
      message: string;
    }
  | {
      data: undefined;
      error: true;
      message: string;
    };

// type PageInfo = {
//   currentPage: number;
//   hasNextPage: boolean;
//   lastPage: number;
//   perPage: number;
//   total: number;
// };

type PageArgs = {
  page?: number;
  perPage?: number;
};

type MediaResponse<T> = {
  gql: string;
  mediaQuery: string;
  variables: MediaArgs;
  queryArgs: string[];
  query: () => Promise<ResponseData<T>>;
};

type PageResponse<T> = {
  media: (args: MediaArgs, data: string[]) => MediaResponse<T>;
};

// type GetFullSeasonChainResponse = ResponseData;

const genreCollection = [
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
] as const;

export type GenreCollection = typeof genreCollection;

// type Genres = {
//   GenreCollection: GenreCollection;
// };

const anilist = () => {
  const api: string = "https://graphql.anilist.co";
  const baseURL = getHostName();

  const query = async <TData = any, TVars = any>(
    gql: string,
    variables: TVars | object,
  ): Promise<ResponseData<TData>> => {
    try {
      const res = await axios.get<AxiosResponse<TData>>(
        `${baseURL}/proxy/json`,
        {
          params: {
            method: "post",
            url: api,
            data: JSON.stringify({
              query: gql,
              variables,
            }),
            headers: JSON.stringify({
              "Content-Type": "application/json",
              Accept: "application/json",
            }),
          },
        },
      );

      const { data } = res.data;

      return {
        data,
        error: false,
        message: "success",
      };
    } catch (error: any) {
      const eMessage: any = error?.response?.data?.errors;
      return {
        data: undefined,
        error: true,
        message: eMessage || error.message || error,
      };
    }
  };

  const media = <T>(
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

    const start = isPaginated ? "media" : "Media";

    const q = (s: string) => `query(${queryArgs.map((q) => " " + q)}) { ${s}} `;

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
        const res = await query<T, MediaArgs>(gql, variables);
        return res;
      },
    };
  };

  const page = <T>({
    page = 1,
    perPage = 10,
    pageInfo = false,
  }: PageArgs & { pageInfo?: boolean }): PageResponse<T> => {
    const includePageInfo = pageInfo
      ? `pageInfo { currentPage hasNextPage lastPage perPage total } `
      : "";

    const q = (mediaQuery: string, queryArgs: string[]) =>
      `query($page: Int, $perPage: Int,${queryArgs.map(
        (a) => " " + a,
      )} ) { Page(page: $page, perPage: $perPage) { ${mediaQuery} ${includePageInfo}} }`;

    return {
      media: (args: MediaArgs, data: string[]): MediaResponse<T> => {
        const res = media(args, data, true);
        const { variables, mediaQuery, queryArgs } = res;
        const gql = q(mediaQuery, queryArgs);

        return {
          query: async (): Promise<ResponseData<T>> => {
            const res = await query<T, MediaArgs & PageArgs>(gql, {
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
  };

  const getFullSeasonChain = async (
    id: number,
    filter?: GetFullSeasonChainFilter,
  ) => {
    const baseQuery = [
      "id",
      "type",
      "idMal",
      "title { romaji english native}",
      "season",
      "seasonYear",
      "format",
    ];

    const queryData: string[] = [
      ...baseQuery,
      "nextAiringEpisode { airingAt }",
      `relations {
          edges {
              relationType
              node {
                  ${baseQuery.map((item) => item).join("\n")}
              }
          }
        }`,
    ];

    try {
      const response = await media<MediaRelations>(
        { id: id },
        queryData,
      ).query();

      if (response.error) throw new Error(response.message);

      if (filter) {
        const { type, relationType, format } = filter;

        const media = response.data.Media;
        const relations = media.relations.edges
          .map((edge) => {
            const { node } = edge;

            if (type && type !== node.type) return null;
            if (relationType && !relationType.includes(edge.relationType))
              return null;
            if (format && !format?.includes(node.format)) return null;

            return edge;
          })
          .filter((value) => value !== null);

        const filtered = { ...media, relations };
        return filtered;
      }

      return response;
    } catch (e: any) {
      return {
        data: undefined,
        error: true,
        message: e.message || e,
      };
    }
  };

  return {
    query,
    media,
    page,
    getFullSeasonChain,
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
