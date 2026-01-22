import allanime from "../../extensions/anime/allanime(refactored)/allanime.js";
import type { Base } from "../../extensions/anime/base/Base.js";
import type { Request, Response } from "express";
import type {
  Extensions,
  Translation,
} from "../../shared-types/extensions/anime";
import Fuse from "fuse.js";

const extensions = new Map<Extensions, ReturnType<Base>>([
  ["allanime", allanime()],
  ["hentai haven", allanime()],
]);

const responseTemplate = {
  data: null,
  error: true,
  message: "",
  status: 400,
};

const searchAnime = async (req: Request, res: Response): Promise<void> => {
  type Query = {
    extension?: Extensions;
    query?: string;
    idMal?: string;
  };

  const { extension = "allanime", query = "", idMal } = req.query as Query;

  try {
    const provider = extensions.get(extension);

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
      res.status(status).json({
        ...responseTemplate,
        error,
        message,
        status,
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
        message: `Result found`,
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
      message: "Result found",
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

const getEpisode = async (req: Request, res: Response): Promise<void> => {
  type Query = {
    extension?: Extensions;
    id?: string;
    translation?: Translation;
    episode?: string | number;
  };

  const {
    extension = "allanime",
    id,
    translation = "sub",
    episode = 1,
  } = req.query as Query;

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

    if (error) throw new Error(message);

    res.status(status).json({
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

export { searchAnime, getEpisode };
