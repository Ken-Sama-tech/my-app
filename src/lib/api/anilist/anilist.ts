import axios, { type AxiosResponse } from "axios";
import type {
  MediaArgs,
  ResponseData,
  PageArgs,
  MediaResponse,
  PageResponse,
  Genres,
} from "./types/anilist";

const anilist = () => {
  const api: string = "https://graphql.anilist.co";

  return {
    query: async <TData, TVars>(
      gql: string,
      variables: TVars | object
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
        };
      } catch (error: any) {
        return {
          error: true,
          message: error || error.message,
        };
      }
    },

    media: <T>(
      args: MediaArgs,
      data: string[],
      isPaginated: boolean = false
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

    Page: <T>({
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
          (a) => " " + a
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

    genres: async (): Promise<ResponseData<Genres>> => {
      const self = anilist();
      const genres = await self.query<Genres, {}>(
        `query{ GenreCollection }`,
        {}
      );

      const { data, error, message } = genres;

      if (error) {
        return {
          error,
          message,
        };
      }

      return {
        data,
        message,
      };
    },
  };
};

export default anilist;
