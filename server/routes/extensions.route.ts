import express, { type Request, Response, Router } from "express";
import {
  loadEntry as loadAllanime,
  entry as allanime,
} from "../../extensions/anime/allanime/loadAnime";

const router: Router = express.Router();

router.get("/anime", async (req: Request, res: Response) => {
  const result = [];

  try {
  } catch (error) {}
});

export default router;
