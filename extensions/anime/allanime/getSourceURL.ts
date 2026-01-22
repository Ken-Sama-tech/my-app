import axios from "axios";
import { allAnimeHeaders, baseURL as base } from "./vars.js";
import type {
  TranslationType,
  AllAnimeResponse,
  GetSourceURLResponse,
  GetSourceURLResponseData,
  Variables,
} from "./index.js";
import type { AxiosResponse } from "axios";

const getSourceURL = async (
  showId: string,
  translationType: TranslationType = "sub",
  episodeString: string = "1"
): Promise<AllAnimeResponse<GetSourceURLResponseData>> => {
  try {
    if (!showId) {
      return {
        error: true,
        message: "Parameter showId cannot be empty",
        status: 400,
      };
    }

    const gql = `
        query (
            $showId: String!,
            $translationType: VaildTranslationTypeEnumType!,
            $episodeString: String!
            ) {
                episode(
                    showId: $showId 
                    translationType: $translationType
                    episodeString: $episodeString
                ) {
                    episodeString
                    sourceUrls
                }
            }
    `;

    const variables: Variables = {
      showId,
      translationType,
      episodeString,
    };

    const res: AxiosResponse<GetSourceURLResponse> = await axios.get(
      `${base}/api`,
      {
        headers: allAnimeHeaders,
        params: {
          query: gql,
          variables: JSON.stringify(variables),
        },
      }
    );

    const { data } = res.data;

    return {
      data: data.episode,
      message: "Successfully extracted episode sources",
      status: 200,
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message || error,
      status: error.status || 500,
    };
  }
};

export default getSourceURL;
