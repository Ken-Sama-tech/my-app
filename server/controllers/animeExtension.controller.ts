import type { Base } from "../../extensions/anime/Base/index.js";
import type { Request, Response } from "express";
import type {
  Languages,
  Translation,
  ValidExtensionId,
  Id,
} from "../../shared-types/extensions/index.js";
import type {
  SearchAnimeResBody,
  GetTranslationsResBody,
  GetEpisodeListResBody,
  GetEpisodeResBody,
} from "../../shared-types/controllers/animeExtensions.js";
import Fuse from "fuse.js";
import { allanime, hentaiHaven } from "../../extensions/anime/index.js";
import { defaultExtension } from "../../vars/index.js";

export type CommonReqQuery = {
  extension?: ValidExtensionId;
};

type SearchAnimeReqQuery = CommonReqQuery & {
  query?: string;
  idMal?: string;
};

type GetTranslationReqQuery = CommonReqQuery & {
  id: Id;
};

type GetEpisodeListReqQuery = CommonReqQuery & {
  id: Id;
  translation?: Translation;
  lang?: Languages;
};

type GetEpisodeReqQuery = CommonReqQuery & {
  id: Id;
  translation?: Translation;
  episode?: string | number;
};

const extensions = new Map<ValidExtensionId, ReturnType<Base>>([
  ["699a693514082cb82a291c71", allanime()],
  ["699a69a314082cb82a291c72", hentaiHaven()],
]);

const searchAnime = async (
  req: Request<null, SearchAnimeResBody, null, SearchAnimeReqQuery>,
  res: Response<SearchAnimeResBody>,
): Promise<void> => {
  const { extension = defaultExtension, query = "", idMal } = req.query;

  try {
    const provider = extensions.get(extension as ValidExtensionId);

    const response = await provider!.search(query);

    const { payload, error, message, status } = response;

    if (error) {
      res.status(status).json({
        data: {
          extensionId: extension,
        },
        error,
        message,
        status,
      });

      return;
    }

    if (!payload) {
      res.status(404).json({
        data: {
          extensionId: extension,
        },
        error: true,
        message: "Not found",
        status: 404,
      });
      return;
    }

    const { results, name: providerName } = payload;

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
          data: {
            extensionId: extension,
          },
          error: true,
          message: `Please make sure that malid "${idMal}" corresponds to anime "${query}"`,
          status: 404,
        });
        return;
      }

      const { alternatives, ...rest } = anime;
      res.status(200).json({
        data: {
          extensionId: extension,
          name: providerName,
          result: rest,
        },
        error: false,
        message: "success",
        status: 200,
      });
      return;
    }

    const matches = fuse.search(query).map((r) => {
      return {
        data: r.item,
        score: r.score || 0,
      };
    });

    if (!matches[0]) {
      res.status(404).json({
        data: {
          extensionId: extension,
        },
        error: true,
        message: `Can't find an anime with title "${query}"`,
        status: 404,
      });
      return;
    }

    const { alternatives, ...rest } = matches[0].data;

    res.status(200).json({
      data: {
        extensionId: extension,
        name: providerName,
        result: rest,
      },
      error: false,
      message: "sucess",
      status: 200,
    });
  } catch (e: any) {
    res.status(500).json({
      data: {
        extensionId: extension,
      },
      error: true,
      message: e?.message || e,
      status: 500,
    });
  }
};

const getTranslations = async (
  req: Request<null, GetTranslationsResBody, null, GetTranslationReqQuery>,
  res: Response<GetTranslationsResBody>,
): Promise<void> => {
  const { id, extension = defaultExtension } = req.query;

  try {
    const provider = extensions.get(extension);

    const response = await provider!.getTranslations(id);

    const { payload, message, error, status } = response;

    if (error) {
      res.status(status).json({
        data: {
          extensionId: extension,
        },
        error: true,
        message,
        status,
      });
      return;
    }

    if (!payload) {
      res.status(404).json({
        data: {
          extensionId: extension,
        },
        error: true,
        message: "Not found",
        status: 404,
      });
      return;
    }

    res.status(200).json({
      data: { ...payload, extensionId: extension },
      error: false,
      message: "success",
      status: 200,
    });
  } catch (e: any) {
    res.status(500).json({
      data: {
        extensionId: extension,
      },
      error: true,
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
    extension = defaultExtension,
    id,
    translation = "sub",
    lang = "Eng",
  } = req.query;

  try {
    const provider = extensions.get(extension);

    const response = await provider!.getEpisodeList(id, { translation, lang });

    const { payload, message, error, status } = response;

    if (error) {
      res.status(status).json({
        data: {
          extensionId: extension,
        },
        error: true,
        message,
        status,
      });
      return;
    }

    if (!payload) {
      res.status(404).json({
        data: {
          extensionId: extension,
        },
        error: true,
        message: "Not found",
        status: 404,
      });
      return;
    }

    res.status(200).json({
      data: { ...payload, extensionId: extension },
      error,
      message,
      status: 200,
    });
  } catch (e: any) {
    res.status(500).json({
      data: {
        extensionId: extension,
      },
      error: true,
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
    extension = defaultExtension,
    id,
    translation = "sub",
    episode = 1,
  } = req.query;

  try {
    const provider = extensions.get(extension);

    const response = await provider!.getEpisodeLink(id, {
      translation,
      episode: Number(episode),
    });

    const { payload, message, status, error } = response;

    if (error) {
      res.status(status).json({
        data: {
          extensionId: extension,
        },
        error: true,
        message,
        status,
      });
      return;
    }

    if (!payload) {
      res.status(404).json({
        data: {
          extensionId: extension,
        },
        error: true,
        message: "Not found",
        status: 404,
      });
      return;
    }

    res.status(200).json({
      data: { ...payload, extensionId: extension },
      status: 200,
      message: message,
      error: false,
    });
  } catch (e: any) {
    res.status(500).json({
      data: {
        extensionId: extension,
      },
      error: true,
      message: e.message || e,
      status: 500,
    });
  }
};

export default extensions;
export { searchAnime, getEpisode, getEpisodeList, getTranslations };
