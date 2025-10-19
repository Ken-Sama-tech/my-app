import express, { type Router } from "express";

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

export default router;
