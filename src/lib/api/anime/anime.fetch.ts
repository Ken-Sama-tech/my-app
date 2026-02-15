import getHostName from "../../utils/getHostName";
import axios from "axios";
import type {
  FetchAnimeArgs,
  FetchAnimeResponse,
  FetchEpisodeListArgs,
  FetchEpisodeListResponse,
  FetchEpisodeArgs,
  FetchEpisodeResponse,
  FetchTranslationsArgs,
  FetchTranslationsResponse,
} from "./anime.types";
import type {
  SearchAnimeResBody,
  GetEpisodeListResBody,
} from "../../../../shared-types/controllers/animeExtensions";

const baseURL = getHostName();
const animeExtURL = `${baseURL}/extensions/anime`;
const searchURL = `${animeExtURL}/search`;
const episodeListURL = `${animeExtURL}/episodes`;
const episodeURL = `${animeExtURL}/episode`;
const translationsURL = `${animeExtURL}/translations`;

export const fetchAnime = async (
  args: FetchAnimeArgs,
): Promise<FetchAnimeResponse[]> => {
  const { extensions, title, idMal } = args;

  const results = await Promise.all(
    extensions.map(async (extension) => {
      try {
        const response = await axios.get<SearchAnimeResBody>(searchURL, {
          params: {
            extension,
            query: title,
            idMal: idMal,
          },
        });

        const { data } = response;

        return data;
      } catch (e: any) {
        return {
          data: {
            extension,
          },
          error: true,
          message: e?.message || e,
          status: e.status || 400,
        };
      }
    }),
  );

  return results;
};

export const fetchTranslations = async (
  args: FetchTranslationsArgs,
): Promise<FetchTranslationsResponse> => {
  const { id, extension = "allanime" } = args;

  try {
    const response = await axios.get<FetchTranslationsResponse>(
      translationsURL,
      {
        params: {
          id,
          extension,
        },
      },
    );

    console.log(response.data);
    return response.data;
  } catch (e: any) {
    return {
      data: null,
      error: true,
      message: e.message || e,
      status: e.status || 400,
    };
  }
};

export const fetchEpisodeList = async (
  args: FetchEpisodeListArgs,
): Promise<FetchEpisodeListResponse> => {
  const {
    id,
    extension = "allanime",
    translation = "sub",
    lang = "Eng",
  } = args;

  try {
    const response = await axios.get<GetEpisodeListResBody>(episodeListURL, {
      params: {
        id,
        extension,
        translation,
        lang,
      },
    });

    return response.data;
  } catch (e: any) {
    return {
      data: {
        extension,
      },
      error: true,
      message: e.message || e,
      status: e.status || 400,
    };
  }
};

export const fetchEpisode = async (
  args: FetchEpisodeArgs,
): Promise<FetchEpisodeResponse> => {
  const { id, extension = "allanime", translation = "sub", episode = 1 } = args;

  try {
    const response = await axios.get<FetchEpisodeResponse>(episodeURL, {
      params: {
        id,
        extension,
        translation,
        episode,
      },
    });

    return response.data;
  } catch (e: any) {
    return {
      data: null,
      error: true,
      message: e.message || e,
      status: e.status || 400,
    };
  }
};
