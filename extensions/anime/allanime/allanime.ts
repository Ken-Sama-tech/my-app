import type {
  Base,
  Search,
  SearchResponse,
  GetEpisodeLink,
  GetEpisodeLinkResponse,
  GetEpisodeList,
  GetEpisodeListResponse,
  GetTranslations,
  GetTranslationsResponse,
} from "../base";
import {
  searchQuery,
  getEpisodeLinkQuery,
  getEpisodeListQuery,
} from "./vars.js";
import type {
  SearhVariables,
  GetEpisodeLinkVariables,
  SearchResponse as AllAnimeSearchResponse,
  GetEpisodeLinkResponse as AllAnimeSourceUrls,
  GetEpisodeListResponse as AllAnimeEpisodeList,
} from "./types";
import { hexDecoder } from "./utils.js";
import axios from "axios";

const allanime: Base = () => {
  const api = "https://api.allanime.day/api";
  const limit = 41;
  const page = 1;
  const headers = {
    Referer: "https://allmanga.to",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
  };

  const name = "allanime";

  const search: Search = async (query: string): Promise<SearchResponse> => {
    const gql = searchQuery;

    const variables: SearhVariables = {
      search: {
        allowAdult: true,
        allowUnknown: false,
        query: query,
      },
      limit,
      page,
      translationType: "sub",
      countryOrigin: "ALL",
    };

    try {
      const response = await axios.get<AllAnimeSearchResponse>(api, {
        params: {
          query: gql,
          variables: JSON.stringify(variables),
        },
        headers,
      });

      const { data } = response.data;

      return {
        payload: {
          extension: name,
          results: data.shows.edges.map((anime) => {
            const { name, altNames = [], malId, _id } = anime;

            return {
              title: name,
              alternatives: altNames,
              malId: Number(malId),
              id: _id,
            };
          }),
        },
        error: false,
        message: `${data?.shows?.edges.length} result/s found`,
        status: 200,
      };
    } catch (e: any) {
      return {
        payload: {
          results: [],
          extension: name,
        },
        error: true,
        message: e?.message || e,
        status: e?.status || 400,
      };
    }
  };

  const getEpisodeList: GetEpisodeList = async (
    id,
    { translation = "sub" } = {},
  ): Promise<GetEpisodeListResponse> => {
    try {
      const response = await axios.get<AllAnimeEpisodeList>(api, {
        params: {
          query: getEpisodeListQuery,
          variables: JSON.stringify({
            showId: id,
          }),
        },
        headers,
      });

      const { data } = response.data;

      const episodes = data.show.availableEpisodes[translation];

      const episodeList = Array.from({ length: episodes }, (_, i) => {
        const e = i + 1;
        return {
          episodeTitle: `Episode ${e}`,
          episode: e,
        };
      });

      return {
        payload: {
          extension: name,
          id: id,
          translation,
          language: "Eng",
          episodeList,
        },
        message: "success",
        error: false,
        status: 200,
      };
    } catch (e: any) {
      return {
        payload: {
          extension: name,
          id: id,
          translation,
          language: "Eng",
          episodeList: [],
        },
        error: true,
        message: e?.message || e,
        status: e?.status || 500,
      };
    }
  };

  const getTranslations: GetTranslations = async (
    id,
  ): Promise<GetTranslationsResponse> => {
    try {
      const response = await axios.get<AllAnimeEpisodeList>(api, {
        params: {
          query: getEpisodeListQuery,
          variables: {
            showId: id,
          },
        },
        headers,
      });

      const { data } = response.data;

      const episodes = data.show.availableEpisodes;

      return {
        payload: {
          extension: name,
          subs: [
            {
              lang: "Eng",
              episodes: episodes.sub,
            },
          ],
          dubs: [
            {
              lang: "Eng",
              episodes: episodes.dub,
            },
          ],
        },
        error: false,
        message: "success",
        status: 200,
      };
    } catch (e: any) {
      return {
        payload: {
          extension: name,
        },
        error: true,
        message: e?.message || e,
        status: 400,
      };
    }
  };

  const getEpisodeLink: GetEpisodeLink = async (
    id: string,
    { translation = "sub", episode = 1 } = {},
  ): Promise<GetEpisodeLinkResponse> => {
    const gql = getEpisodeLinkQuery;

    const variables: GetEpisodeLinkVariables = {
      showId: id,
      translationType: translation,
      episodeString: String(episode),
    };

    try {
      const response = await axios.get<AllAnimeSourceUrls>(api, {
        params: {
          query: gql,
          variables: JSON.stringify(variables),
        },
        headers,
      });

      const { data } = response.data;

      const players = data.episode.sourceUrls
        .map((source) => {
          if (source.type != "player") return;

          source.sourceUrl = hexDecoder(source.sourceUrl);

          return source;
        })
        .filter((source) => source !== undefined)
        .sort((a, b) => b?.priority - a?.priority);

      return {
        payload: {
          extension: name,
          referrer: headers.Referer,
          lang: "Eng",
          episode,
          translation,
          episodeTitle: `Episode ${episode}`,
          sources: [
            ...players.map((source) => {
              return {
                name: source?.sourceName || "",
                url: source?.sourceUrl || "",
              };
            }),
          ],
        },
        message: "success",
        status: 200,
        error: false,
      };
    } catch (e: any) {
      return {
        payload: {
          sources: [],
          episode,
          episodeTitle: "",
          translation,
          lang: "Eng",
          extension: name,
          referrer: headers.Referer,
        },
        message: e.message || e,
        error: true,
        status: e?.status || 400,
      };
    }
  };

  return {
    extension: name,
    referrer: headers.Referer,
    search,
    getEpisodeList,
    getTranslations,
    getEpisodeLink,
  };
};

export default allanime;
