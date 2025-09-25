import express, { type Request, Response, Router } from "express";
import allanimeExt from "../../extensions/anime/allanime/loadAnime.js";

const router: Router = express.Router();
const allanime = allanimeExt();

router.get("/anime", async (req: Request, res: Response) => {
  const result = [];

  try {
  } catch (error) {}
});

export default router;
