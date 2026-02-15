import express from "express";
import type { Router } from "express";

const router: Router = express.Router();
//extensions --------------------------------
import {
  getExtensions,
  updateExtensions,
} from "../controllers/extensions.controller.js";

router.get("/", getExtensions);
router.patch("/update/:id", updateExtensions);

//anime extensions --------------------------
import {
  searchAnime,
  getTranslations,
  getEpisodeList,
  getEpisode,
} from "../controllers/animeExtension.controller.js";

router.get("/anime/search", searchAnime);
router.get("/anime/translations", getTranslations);
router.get("/anime/episodes", getEpisodeList);
router.get("/anime/episode", getEpisode);

//manga extensions --------------------------

//novel extensions --------------------------

export default router;
