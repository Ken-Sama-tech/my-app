import express from "express";
import type { Response, Request, Router } from "express";
import axios from "axios";
import { Readable } from "stream";
import type { Method } from "axios";

const router: Router = express.Router();

router.get("/json", async (req: Request, res: Response) => {
  const {
    url,
    params,
    headers,
    data,
    method = "GET",
  } = req.query as {
    url: string;
    params?: string;
    method?: Method;
    headers?: string;
    data?: string;
  };

  try {
    if (!url) {
      res.status(400).json({
        error: true,
        message: `"url" parameter is required`,
      });
    }

    const response = await axios.request({
      method,
      url,
      ...(headers && { headers: JSON.parse(headers) }),
      ...(params && { params: JSON.parse(params) }),
      ...(data && { data: JSON.parse(data) }),
    });

    res.send(response.data);
  } catch (e: any) {
    res.status(500).json({
      error: true,
      message: e.message || e,
    });
  }
});

router.get("/player", async (req: Request, res: Response) => {
  const { referrer, url } = req.query as { referrer: string; url: string };

  if (!referrer || !url)
    return res.status(400).json({
      error: true,
      message: "Referrer or url cannot be missing",
    });

  try {
    const range = req.headers.range;
    const response = await axios.get<Readable>(url, {
      responseType: "stream",
      headers: {
        Referer: referrer,
        Range: range,
      },
      validateStatus: () => true,
    });

    const contentType = response.headers["content-type"];
    const contentLength = response.headers["content-length"];
    const acceptRanges = response.headers["accept-ranges"];
    const contentRange = response.headers["content-range"];

    if (contentType) res.setHeader("Content-Type", contentType);
    if (contentLength) res.setHeader("Content-Length", contentLength);
    if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);
    if (contentRange) res.setHeader("content-range", contentRange);

    res.status(response.status);
    response.data.pipe(res);
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || error,
    });
  }
});

export default router;
