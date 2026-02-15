import type { Response, Request } from "express";
import type { AnimeSchema } from "../models/Media";
import { Anime } from "../models/Media";
import conn from "../config/config.js";

const insertAnime = async (req: Request, res: Response): Promise<void> => {
  const { title, anlId } = req.body;
  const { romaji, english, native } = title || {};

  try {
    await conn();

    if ((!romaji && !english && !native) || !anlId) {
      res.status(400).json({
        data: null,
        error: true,
        message: `Field "anlid" or "title" cannot be empty`,
        status: 400,
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
      error: false,
      message: "Sucessfully added anime document",
      status: 200,
    });
  } catch (e: any) {
    const error = {
      data: null,
      error: true,
      message: e.message || e,
      status: 500,
    };
    console.error("Error", error);
    res.status(500).json(error);
  }
};

export { insertAnime };
