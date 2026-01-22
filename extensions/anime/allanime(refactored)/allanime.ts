import type {
  Base,
  Search,
  SearchResponse,
  GetEpisodeLink,
  GetEpisodeLinkResponse,
} from "../base";
import { searchQuery, getEpisodeLinkQuery } from "./vars.js";
import type {
  SearhVariables,
  GetEpisodeLinkVariables,
  SearchResponse as AllAnimeSearchResponse,
  GetEpisodeLinkResponse as AllAnimeSourceUrls,
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
            const {
              name,
              altNames = [],
              malId,
              _id,
              availableEpisodes,
            } = anime;

            return {
              title: name,
              alternatives: altNames,
              malId: Number(malId),
              id: _id,
              episodes: {
                subs: [
                  {
                    lang: "Eng",
                    availableEpisodes: availableEpisodes?.sub || 0,
                  },
                ],
                dubs: [
                  {
                    lang: "Eng",
                    availableEpisodes: availableEpisodes?.dub || 0,
                  },
                ],
              },
            };
          }),
        },
        error: false,
        message: `${data?.shows?.edges.length} results found`,
        status: 200,
      };
    } catch (e: any) {
      return {
        payload: {
          results: [],
          extension: name,
        },
        error: true,
        message: e.message || "Bad request",
        status: e.status || 400,
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
          lang: "Eng",
          episode,
          translation,
          sources: [
            ...players.map((source) => {
              return {
                name: source?.sourceName || "",
                url: source?.sourceUrl || "",
              };
            }),
          ],
        },
        message: "Result Found",
        status: 200,
        error: false,
      };
    } catch (e: any) {
      return {
        payload: {
          sources: [],
          episode,
          translation,
          lang: "Eng",
          extension: name,
        },
        message: e.message || e,
        error: true,
        status: e.status,
      };
    }
  };

  return {
    extension: name,
    referrer: headers.Referer,
    search,
    getEpisodeLink,
  };
};

export default allanime;
