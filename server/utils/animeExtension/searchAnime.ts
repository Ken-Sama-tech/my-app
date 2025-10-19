import allanimeExt from "../../../extensions/anime/allanime/loadAnime.js";
import type { AnimeExtensions } from "../../models/types/Extensions";

export type SearchAnimeUtilResponse = {
  readonly extension: AnimeExtensions;
  readonly data?: {
    readonly title: string;
    readonly thumbnail: string;
    readonly episodes: {
      readonly sub: number;
      readonly dub: number;
    };
  };
  readonly status: number;
  readonly message: string;
  readonly error: boolean;
  idMal?: string;
};

type SearchAnimeArguments = {
  title: string;
  idMal: number | string;
  ext: AnimeExtensions | AnimeExtensions[];
};

type SeachAnime = (
  args: SearchAnimeArguments,
  callback?: (result: SearchAnimeUtilResponse[]) => void
) => void;

const allanime = allanimeExt();

const searchAnime: SeachAnime = async ({ title, idMal, ext }, callback) => {
  const extensions: AnimeExtensions[] = typeof ext === "string" ? [ext] : ext;

  const result: SearchAnimeUtilResponse[] = [];

  if (extensions.includes("allanime")) {
    const { entry, hasEntry } = await allanime.anime(title, Number(idMal));

    if (!hasEntry) {
      result.push({
        extension: allanime.name,
        error: true,
        status: 404,
        message: "No result found",
      });
    } else {
      const data = {
        title: entry.name,
        thumbnail: entry.thumbnail,
        episodes: {
          sub: entry.availableEpisodes.sub,
          dub: entry.availableEpisodes.dub,
        },
      };

      result.push({
        extension: allanime.name,
        data,
        error: false,
        status: 200,
        message: "Found result",
        idMal: entry.malId,
      });
    }
  }

  if (extensions.includes("Hentai Haven")) {
    result.push({
      extension: "Hentai Haven",
      data: null,
      error: true,
      status: 404,
      message: "No result found",
    });
  }

  callback(result);
};

export default searchAnime;
