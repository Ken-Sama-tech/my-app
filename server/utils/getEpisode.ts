import allanimeExt, {
  type TranslationType,
  LoadEpisodeResponse,
} from "../../extensions/anime/allanime/loadAnime.js";

type Arguments = {
  idMal?: number;
  title: string;
  episode?: number;
};

type GetRestOfTheEpisodesResponse = {
  readonly [K in keyof LoadEpisodeResponse]?: LoadEpisodeResponse[K];
} & {
  readonly error?: boolean;
  readonly message?: string;
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
) => Promise<Array<GetRestOfTheEpisodesResponse>>;

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

      const episodeUrls: Array<GetRestOfTheEpisodesResponse> = [];

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
            console.log(response);

            if (!response) {
              episodeUrls.push({
                translationType,
                currentEpisode: i,
                error: true,
                message: "Episode not found",
              });
              continue;
            }

            episodeUrls.push(response);
          }

          return episodeUrls;
        },
      };
    }
  }
};

export default getEpisode;
