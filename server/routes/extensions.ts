import express, { type Request, Response, Router } from "express";
import allanimeExt, {
  type TranslationType,
} from "../../extensions/anime/allanime/loadAnime.js";
import getEpisode from "../utils/getEpisode.js";
import type { AnimeExtensions } from "../models/types/Extensions.js";
import {
  getExtensions,
  updateExtension,
  getExtension,
} from "../controllers/extensionsController.js";

const router: Router = express.Router();
const allanime = allanimeExt();

type AnimeExtensionArguments = {
  readonly ext: AnimeExtensions | AnimeExtensions[];
  readonly title: string;
  readonly idMal: string;
};

router.get("/", getExtensions);

router.patch("/anime/update", updateExtension);

router.get("/anime/search", async (req: Request, res: Response) => {
  const result = [];
  try {
    const { ext, title, idMal } = req.query as AnimeExtensionArguments;

    if (!ext) {
      res.json({
        data: [],
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

    const extensions = typeof ext === "string" ? [ext] : ext;

    if (extensions.includes("allanime")) {
      const { entry, hasEntry } = await allanime.anime(title, Number(idMal));

      if (!hasEntry) {
        res.status(404).json({
          error: true,
          message: "No result found",
        });
        return;
      }
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
      });
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: true, message: error.message || error });
  }
});

router.get("/anime/episode", async (req: Request, res: Response) => {
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

    const response = await getEpisode(
      { title, idMal: Number(idMal), episode: Number(episode) },
      {
        extension: Array.isArray(ext) ? ext[0] : ext,
        translationType,
      }
    );

    const { data, error, extension, message } = response;

    if (error) {
      throw new Error(`${extension}: ${message}`);
    }

    // const episodes = await response.getRestOfTheEpisodes(
    //   Number(episode),
    //   Number(episode) + 19
    // );

    res.status(200).send(data.html);
  } catch (error: any) {
    res.status(500).json({ error: true, message: error.message || error });
  }
});

router.get("anime/:id", getExtension);

export default router;
