import axios, { type AxiosResponse } from "axios";
import { allAnimeHeaders, baseURL as base } from "./vars.js";
import type {
  AllAnimeResponse,
  AllAnimeSearchVariables,
  AllAnimeSearchResponse,
  SearchResponseData,
} from "./index.js";

const search = async (
  query: string
): Promise<AllAnimeResponse<SearchResponseData>> => {
  try {
    if (!query) {
      return {
        status: 400,
        error: true,
        message: "Query parameter cannot be empty",
      };
    }

    const gql: string = `
    query(
        $search: SearchInput,
        $limit: Int,
        $page: Int,
        $translationType: VaildTranslationTypeEnumType,
        $countryOrigin: VaildCountryOriginEnumType
    ) {
    shows(
        search: $search,
        limit: $limit,
        page: $page,
        translationType: $translationType,
        countryOrigin: $countryOrigin
    ) {
        edges {
          _id
          malId
          thumbnail
          name
          availableEpisodes
          __typename
        }
    }
    }
  `;

    const variables: AllAnimeSearchVariables = {
      search: {
        allowAdult: true,
        allowUnknown: false,
        query: query,
      },
      limit: 40,
      page: 1,
      translationType: "sub",
      countryOrigin: "ALL",
    };

    const res: AxiosResponse<AllAnimeSearchResponse> = await axios.get(
      `${base}/api`,
      {
        params: {
          query: gql,
          variables: JSON.stringify(variables),
        },
        headers: allAnimeHeaders,
      }
    );

    const { data } = res.data;

    return {
      data: data?.shows.edges,
      message: "Found Result",
      status: 200,
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      status: error.status || 500,
    };
  }
};

export default search;
