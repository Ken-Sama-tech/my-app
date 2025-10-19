import type { Request, Response } from "express";
import Extensions from "../models/Extensions.js";
import conn from "../config/config.js";
import type {
  ExtensionsResponse,
  ExtensionTypes,
} from "../models/types/Extensions.js";
import type { ObjectId } from "mongoose";
import { type TranslationType } from "../../extensions/anime/allanime/loadAnime.js";
import getEpisode from "../utils/animeExtension/getEpisode.js";
import type { AnimeExtensions } from "../models/types/Extensions.js";
import searchAnime from "../utils/animeExtension/searchAnime.js";

//types
type AnimeDocumentFields = {
  -readonly [K in keyof ExtensionsResponse]?: ExtensionsResponse[K];
};

type AnimeExtensionArguments = {
  readonly ext: AnimeExtensions | AnimeExtensions[];
  readonly title: string;
  readonly idMal: string;
};

//extensions
const getExtensions = async (req: Request, res: Response) => {
  type Filter = {
    type?: ExtensionTypes;
  };

  const { type } = req.query as { type?: ExtensionTypes };
  const filter: Filter = {};

  if (type) {
    const allowedTypes: ExtensionTypes[] = ["anime", "manga", "novel"];

    if (allowedTypes.includes(type)) {
      filter["type"] = type;
    }
  }

  try {
    await conn();
    const response = await Extensions.find(filter).sort({ name: -1 });
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || error,
    });
  }
};
const getExtension = async (req: Request, res: Response) => {
  const { id } = req.params as { id?: ObjectId };

  try {
    if (!id) throw new Error("id parameter is required");
    await conn();
    const response = await Extensions.findById<AnimeDocumentFields>({
      _id: id,
    });
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || error,
    });
  }
};
const updateExtension = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { ...data } = req.body as AnimeDocumentFields;
  try {
    await conn();
    const response = await Extensions.updateOne<AnimeDocumentFields>(
      {
        _id: id,
      },
      { $set: { ...data } }
    );

    res.status(200).json({
      ...response,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || error,
    });
  }
};

//anime extensions
const findAnime = async (req: Request, res: Response) => {
  try {
    const { ext, title, idMal } = req.query as AnimeExtensionArguments;

    if (!ext) {
      res.json({
        data: [],
        error: true,
        status: 404,
        message: "No result found",
      });
      return;
    }

    if (!title) {
      res.status(500).json({
        error: true,
        message: "Please provide an anime title to find",
      });
      return;
    }

    searchAnime({ idMal, title, ext }, (result) => {
      res.status(200).json(result);
    });
  } catch (error: any) {
    res.status(500).json({ error: true, message: error.message || error });
  }
};

const fetchEpisodes = async (req: Request, res: Response) => {
  try {
    const {
      ext = "allanime",
      title,
      idMal,
      episode = 1,
      translationType = "sub",
    } = req.query as AnimeExtensionArguments & {
      episode: string;
      translationType: TranslationType;
    };

    if (!title) {
      res.status(500).json({
        error: true,
        message: "Please provide an anime title",
      });
    }

    const getEpisodeRes = await getEpisode(
      { title, idMal: Number(idMal), episode: Number(episode) },
      {
        extension: Array.isArray(ext) ? ext[0] : ext,
        translationType,
      }
    );

    const { /*data,*/ error, extension, message } = getEpisodeRes;

    if (error) {
      res.json({
        message,
        error,
        extension,
      });
      return;
    }

    const episodes = await getEpisodeRes.getRestOfTheEpisodes(
      Number(episode),
      Number(episode) + 10
    );

    res.status(200).json(episodes);
  } catch (error: any) {
    res.status(500).json({ error: true, message: error.message || error });
  }
};

//exports
export {
  getExtensions,
  updateExtension,
  getExtension,
  findAnime,
  fetchEpisodes,
};
