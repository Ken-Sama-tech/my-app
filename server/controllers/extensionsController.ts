import type { Request, Response } from "express";
import Extensions from "../models/Extensions.js";
import conn from "../config/config.js";
import type {
  ExtensionsResponse,
  ExtensionTypes,
} from "../models/types/Extensions.js";
import type { ObjectId } from "mongoose";

type AnimeDocumentFields = {
  -readonly [K in keyof ExtensionsResponse]?: ExtensionsResponse[K];
};

const getExtensions = async (req: Request, res: Response) => {
  type Filter = {
    type?: ExtensionTypes;
  };

  const { type } = req.query as { type?: ExtensionTypes };
  const filter: Filter = {};

  if (type) {
    const allowedTypes: ExtensionTypes[] = ["anime", "manga", "novel"];

    if (allowedTypes.includes(type)) {
      filter["type"] = type;
    }
  }

  try {
    await conn();
    const response = await Extensions.find(filter);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || error,
    });
  }
};

const getExtension = async (req: Request, res: Response) => {
  const { id } = req.params as { id?: ObjectId };

  try {
    if (!id) throw new Error("id parameter is required");
    await conn();
    const response = await Extensions.findById<AnimeDocumentFields>({
      _id: id,
    });
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || error,
    });
  }
};
const updateExtension = async (req: Request, res: Response) => {
  const { _id, ...rest } = req.body as AnimeDocumentFields;
  try {
    await conn();
    const response = await Extensions.updateOne<AnimeDocumentFields>(
      {
        _id,
      },
      { $set: { ...rest } }
    );

    res.status(200).json({
      ...response,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || error,
    });
  }
};

export { getExtensions, updateExtension, getExtension };
