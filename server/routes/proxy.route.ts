import express, { type Response, Request, Router } from "express";
import axios from "axios";
import { Readable } from "stream";

const router: Router = express.Router();

router.get("/player", async (req: Request, res: Response) => {
  const { referrer, url } = req.query as { referrer: string; url: string };

  if (!referrer || !url)
    return res.status(400).json({
      error: true,
      message: "Referrer or url cannot be missing",
    });

  try {
    const response = await axios.get<Readable>(url, {
      responseType: "stream",
      headers: {
        Referer: "https://allmanga.to",
      },
    });

    const contentType = response.headers["content-type"];
    const contentLength = response.headers["content-length"];
    const acceptRanges = response.headers["accept-ranges"];
    const contentRange = response.headers["content-range"];

    if (contentType) res.setHeader("Content-Type", contentType);
    if (contentLength) res.setHeader("Content-Length", contentLength);
    if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);
    if (contentRange) res.setHeader("content-range", contentRange);

    response.data.pipe(res);
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || error,
    });
  }
});

export default router;
