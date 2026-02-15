import allanime from "../../extensions/anime/allanime/index.js";
import type { Base } from "../../extensions/anime/base/index.js";
import type { Request, Response } from "express";
import type {
  AnimeExtensions,
  Languages,
  Translation,
} from "../../shared-types/extensions/anime.js";
import type {
  SearchAnimeResBody,
  GetTranslationsResBody,
  GetEpisodeListResBody,
  GetEpisodeResBody,
} from "../../shared-types/controllers/animeExtensions.js";
import Fuse from "fuse.js";

type SearchAnimeReqQuery = {
  extension?: AnimeExtensions;
  query?: string;
  idMal?: string;
};

type GetTranslationReqQuery = {
  id?: string;
  extension?: AnimeExtensions;
};

type GetEpisodeListReqQuery = {
  extension?: AnimeExtensions;
  id?: string;
  translation?: Translation;
  lang?: Languages;
};

type GetEpisodeReqQuery = {
  extension?: AnimeExtensions;
  id?: string;
  translation?: Translation;
  episode?: string | number;
};

const extensions = new Map<AnimeExtensions, ReturnType<Base>>([
  ["allanime", allanime()],
]);

const responseTemplate = {
  data: null,
  error: true,
  message: "",
  status: 400,
};

const searchAnime = async (
  req: Request<null, SearchAnimeResBody, null, SearchAnimeReqQuery>,
  res: Response<SearchAnimeResBody>,
): Promise<void> => {
  const { extension = "allanime", query = "", idMal } = req.query;

  try {
    if (!query) {
      res.status(400).json({
        ...responseTemplate,
        message: "Missing required parameter 'query'.",
      });
      return;
    }

    if (!extension) {
      res.status(400).json({
        ...responseTemplate,
        message: "Missing required parameter 'extension'.",
      });
      return;
    }

    const provider = extensions.get(extension.toLowerCase() as AnimeExtensions);

    if (!provider) throw new Error("Please provide a valid extension name");

    const response = await provider.search(query);

    const { payload, error, message, status } = response;

    if (error) {
      res.status(status).json({
        ...responseTemplate,
        message,
        status,
      });

      return;
    }

    if (!payload) {
      res.status(404).json({
        ...responseTemplate,
        data: {
          extension: provider.extension,
        },
        message: "Not found",
        status: 404,
      });
      return;
    }

    const { results, extension: providerName } = payload;

    if (!Array.isArray(results))
      throw new Error("Unexpected error: 'results' is not an array");

    const fuse = new Fuse(results, {
      includeScore: true,
      keys: ["title", "alternatives"],
      threshold: 0.2,
    });

    if (idMal) {
      const anime = results.find((res) => res.malId === Number(idMal));

      if (!anime) {
        res.status(404).json({
          ...responseTemplate,
          message: `Please make sure that malid "${idMal}" corresponds to anime "${query}"`,
          status: 404,
        });
        return;
      }

      const { alternatives, ...rest } = anime;
      res.status(200).json({
        data: {
          extension: providerName,
          result: rest,
        },
        error: false,
        message: "success",
        status: 200,
      });
      return;
    }

    const matches = fuse
      .search(query)
      .map((r) => {
        return {
          data: r.item,
          score: r.score || 0,
        };
      })
      .sort((a, b) => b.score - a.score);

    if (!matches[0]) {
      res.status(404).json({
        ...responseTemplate,
        error: false,
        message: `Can't find an anime with title "${query}"`,
        status: 404,
      });
      return;
    }

    const { alternatives, ...rest } = matches[0].data;

    res.status(200).json({
      data: {
        extension: providerName,
        result: rest,
      },
      error: false,
      message: "sucess",
      status: 200,
    });
  } catch (e: any) {
    res.status(500).json({
      ...responseTemplate,
      message: e?.message || e,
      status: 500,
    });
  }
};

const getTranslations = async (
  req: Request<null, GetTranslationsResBody, null, GetTranslationReqQuery>,
  res: Response<GetTranslationsResBody>,
): Promise<void> => {
  const { id, extension = "allanime" } = req.query;

  try {
    if (!id) {
      res.status(400).json({
        ...responseTemplate,
        message: `Missing required parameter 'id'`,
        status: 400,
      });
      return;
    }

    const provider = extensions.get(extension);

    if (!provider) throw new Error("Please provide a valid extension name");

    const response = await provider.getTranslations(id);

    const { payload, message, error, status } = response;

    if (error) {
      res.status(status).json({
        ...responseTemplate,
        message,
        status,
      });
      return;
    }

    if (!payload) {
      res.status(404).json({
        ...responseTemplate,
        message: "Not found",
        status: 404,
      });
      return;
    }

    res.status(200).json({
      data: payload,
      error: false,
      message: "success",
      status: 200,
    });
  } catch (e: any) {
    res.status(500).json({
      ...responseTemplate,
      message: e.message || e,
      status: 500,
    });
  }
};

const getEpisodeList = async (
  req: Request<null, GetEpisodeListResBody, null, GetEpisodeListReqQuery>,
  res: Response<GetEpisodeListResBody>,
): Promise<void> => {
  const {
    extension = "allanime",
    id,
    translation = "sub",
    lang = "Eng",
  } = req.query;

  try {
    const provider = extensions.get(extension);

    if (!id) {
      res.status(400).json({
        ...responseTemplate,
        message: "Missing required parameter 'id'",
        status: 400,
      });
      return;
    }

    if (!provider) throw new Error("Please provide a valid extension name");

    const response = await provider.getEpisodeList(id, { translation, lang });

    const { payload, message, error, status } = response;

    if (error) {
      res.status(status).json({
        ...responseTemplate,
        message,
        status,
      });
      return;
    }

    if (!payload) {
      res.status(404).json({
        ...responseTemplate,
        message: "Not found",
        status: 404,
      });
      return;
    }

    res.status(200).json({
      data: payload,
      error,
      message,
      status: 200,
    });
  } catch (e: any) {
    res.status(500).json({
      ...responseTemplate,
      message: e.message || e,
      status: 500,
    });
  }
};

const getEpisode = async (
  req: Request<null, GetEpisodeResBody, null, GetEpisodeReqQuery>,
  res: Response<GetEpisodeResBody>,
): Promise<void> => {
  const {
    extension = "allanime",
    id,
    translation = "sub",
    episode = 1,
  } = req.query;

  try {
    const provider = extensions.get(extension);

    if (!id) {
      res.status(400).json({
        ...responseTemplate,
        message: "Missing required parameter 'id'.",
      });
      return;
    }

    if (!extension) {
      res.status(400).json({
        ...responseTemplate,
        message: "Missing required parameter 'extension'.",
      });
      return;
    }

    if (!provider) throw new Error("Please provide a valid extension name");

    const response = await provider.getEpisodeLink(id, {
      translation,
      episode: Number(episode),
    });

    const { payload, message, status, error } = response;

    if (error) {
      res.status(status).json({
        ...responseTemplate,
        message,
        status,
      });
      return;
    }

    if (!payload) {
      res.status(404).json({
        ...responseTemplate,
        message: "Not found",
        status: 404,
      });
      return;
    }

    res.status(200).json({
      data: payload,
      status: 200,
      message: message,
      error: false,
    });
  } catch (e: any) {
    res.status(500).json({
      ...responseTemplate,
      message: e.message || e,
      status: 500,
    });
  }
};

export { searchAnime, getEpisode, getEpisodeList, getTranslations };
