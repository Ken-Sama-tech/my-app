import allanimeExt, {
  type TranslationType,
  LoadEpisodeResponse,
} from "../../../extensions/anime/allanime/loadAnime.js";
import { allAnimeHeaders } from "../../../extensions/anime/allanime/vars.js";

type Arguments = {
  idMal?: number;
  title: string;
  episode?: number;
};

type LoadEpisodeFields = {
  readonly [K in keyof LoadEpisodeResponse]: LoadEpisodeResponse[K];
} & {
  error: boolean;
  message: string;
};

type GetRestOfTheEpisodesResponse = {
  episodes: LoadEpisodeFields[];
  referrer: string;
};

type Error = {
  error?: boolean;
  message?: string;
  extension?: string;
};

type Response = {
  data?: LoadEpisodeResponse;
  getRestOfTheEpisodes?: GetRestOfTheEpisodes;
};

type GetRestOfTheEpisodes = (
  start?: number,
  end?: number
) => Promise<GetRestOfTheEpisodesResponse>;

type Options = {
  extension?: string;
  translationType?: TranslationType;
};

type GetEpisode = (
  { idMal, title, episode }: Arguments,
  { extension, translationType }?: Options
) => Promise<Response & Error>;

const getEpisode: GetEpisode = async ({ idMal, title, episode }, options) => {
  const { extension = "allanime", translationType } = options;
  const allanime = allanimeExt();

  switch (extension) {
    case "allanime": {
      const anime = await allanime.loadAnime(title, Number(idMal));

      if (!anime) {
        return {
          error: true,
          extension,
          message: "No result found",
        };
      }

      const loadEpisode = await anime.loadEpisode(
        Number(episode),
        translationType
      );

      const episodes: Array<LoadEpisodeFields> = [];

      return {
        data: loadEpisode,
        getRestOfTheEpisodes: async (start = 1, end = 0) => {
          const episode: number =
            translationType === "sub" ? anime.sub : anime.dub;
          const stopCount = end ? end : episode;
          const startCount = start > episode ? 1 : start;

          for (let i = startCount; i <= stopCount; i++) {
            if (i > episode) break;
            const response = await anime.loadEpisode(i, translationType);

            if (!response) {
              episodes.push({
                translationType,
                episode: i,
                html: "",
                url: null,
                error: true,
                message: "Episode not found",
              });
              continue;
            }

            episodes.push({
              ...response,
              error: false,
              message: "Episodes found",
            });
          }

          return { referrer: allAnimeHeaders.Referer, episodes };
        },
      };
    }
  }
};

export default getEpisode;
