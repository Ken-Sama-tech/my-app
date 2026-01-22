import getHostName from "../../utils/getHostName";
import axios from "axios";
import type {
  FetchAnimeArguments,
  FetchAnimeResponse,
} from "./types/fetchAnime";
const baseURL = getHostName();

export const fetchAnime = async (
  args: FetchAnimeArguments,
): Promise<FetchAnimeResponse> => {
  console.log(baseURL);
  const { extension, title, idMal } = args;

  try {
    const response = await axios.get<FetchAnimeResponse>(
      `${baseURL}/extensions/anime/search/ref`,
      {
        params: {
          extension,
          query: title,
          idMal: idMal,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return {
      data: {
        extension: extension,
      },
      error: true,
      message: error.message || error,
      status: error.status || 400,
    };
  }
};
