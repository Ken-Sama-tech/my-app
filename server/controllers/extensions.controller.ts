import conn from "../config/config.js";
import Extensions from "../models/Extensions.js";
import type {
  AnimeExtensions,
  ExtensionTypes,
  ExtensionsSchema,
} from "../../shared-types/extensions/index.js";
import type { UpdateExtensionsResBody } from "../../shared-types/controllers/index.js";
import type { Response, Request } from "express";
import { ObjectId } from "mongoose";

type GetExtensionsReqQuery = {
  type?: ExtensionTypes;
  active?: string;
  name?: AnimeExtensions;
};

type ExtensionsFields = {
  -readonly [K in keyof ExtensionsSchema]?: ExtensionsSchema[K];
};

export const getExtensions = async (
  req: Request<null, null, null, GetExtensionsReqQuery>,
  res: Response,
): Promise<void> => {
  await conn();
  const { type, active, name } = req.query;

  type Filter = {
    type?: ExtensionTypes;
    active?: boolean;
    name?: AnimeExtensions;
  };

  const filter: Filter = {
    ...(type && { type }),
    ...(active !== undefined && { active: active === "true" }),
    ...(name && { name }),
  };

  try {
    const response = await Extensions.find<ExtensionsSchema>(filter).sort({
      name: 1,
    });

    res.status(200).json({
      data: response,
      error: false,
      message: "success",
      status: 200,
    });
  } catch (e: any) {
    const status = e.status || 500;
    res.status(status).json({
      data: [],
      error: true,
      message: e.message || e,
      status,
    });
  }
};

export const updateExtensions = async (
  req: Request<{ id: ObjectId }, UpdateExtensionsResBody, ExtensionsFields>,
  res: Response<UpdateExtensionsResBody>,
): Promise<void> => {
  const id = req.params.id;
  const body = req.body;

  try {
    if (!id) {
      res.status(400).json({
        acknowledged: false,
        error: true,
        message: 'Missing required parameter "Id"',
        status: 400,
      });
      return;
    }

    await conn();

    const response = await Extensions.updateOne<ExtensionsSchema>(
      { _id: id },
      { $set: body },
    );

    res.status(200).json({
      acknowledged: response.acknowledged,
      error: false,
      message: JSON.stringify(response),
      status: 200,
    });
  } catch (e: any) {
    res.status(500).json({
      acknowledged: false,
      error: true,
      message: e.message || e,
      status: 500,
    });
  }
};
