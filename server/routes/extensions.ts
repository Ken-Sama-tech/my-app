import express from "express";
import type { Router } from "express";

import {
  getExtensions,
  updateExtension,
  getExtension,
  findAnime,
  fetchEpisodes,
} from "../controllers/extensionsController.js";

const router: Router = express.Router();

router.get("/", getExtensions);
router.get("/:id", getExtension);
router.patch("/update/:id", updateExtension);
router.get("/anime/search", findAnime);
router.get("/anime/episodes", fetchEpisodes);

//refactored
import {
  searchAnime,
  getEpisode,
} from "../controllers/extensionController(ref).js";

router.get("/anime/search/ref", searchAnime);
router.get("/anime/episodes/ref", getEpisode);

export default router;
