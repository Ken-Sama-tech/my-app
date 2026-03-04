import express from "express";
import type { Router } from "express";

//middlewares -------------------------------
import {
  validateExtension,
  validateQuery,
  validateId,
} from "../middleware/validation.js";

const router: Router = express.Router();
//extensions --------------------------------
import {
  getExtensions,
  updateExtensions,
} from "../controllers/extensions.controller.js";

router.get("/", getExtensions);
router.patch("/update/:id", updateExtensions);

//anime extensions --------------------------
import validAnimeExtensions, {
  searchAnime,
  getTranslations,
  getEpisodeList,
  getEpisode,
} from "../controllers/animeExtension.controller.js";

const commonAnimeMiddlewares = [validateExtension(validAnimeExtensions)];

router.use("/anime", ...commonAnimeMiddlewares);
router.get("/anime/search", validateQuery, searchAnime);
router.get("/anime/translations", validateId, getTranslations);
router.get("/anime/episodes", validateId, getEpisodeList);
router.get("/anime/episode", validateId, getEpisode);

//manga extensions --------------------------

//novel extensions --------------------------

export default router;
