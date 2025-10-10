import type { Response, Request } from "express";
import type { AnimeSchema } from "../models/Media";
import { Anime } from "../models/Media";
import conn from "../config/config.js";

const insertAnime = async (req: Request, res: Response): Promise<void> => {
  const { title, anlId } = req.body as AnimeSchema;
  const { romaji, english, native } = title || {};

  try {
    await conn();

    if ((!romaji && !english && !native) || !anlId) {
      res.status(500).json({
        error: true,
        message: `Field "anlid" or "title" cannot be empty`,
      });

      return;
    }

    const document: AnimeSchema = {
      ...req.body,
    };

    const result = await Anime.create<AnimeSchema>(document);
    await result.save();

    res.status(200).json({
      data: result,
      message: "Sucessfully added anime document",
    });
  } catch (e: any) {
    const error = {
      error: true,
      message: e.message || e,
    };
    console.error("Error", error);
    res.status(500).json(error);
  }
};

export { insertAnime };
