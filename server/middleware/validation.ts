import type { Request, Response, NextFunction } from "express";
import type { Id, ValidExtensionId } from "../../shared-types/extensions";

type ValidationResponse = {
  data: {
    extensionId: ValidExtensionId;
  };
  error: true;
  message: string;
  status: number;
};

type ValidateReqExtension = {
  extension: ValidExtensionId;
};

type ValidateReqId = {
  id: Id;
} & ValidateReqExtension;

type ValidateReqQuery = {
  query: string;
} & ValidateReqExtension;

export const validateQuery = (
  req: Request<null, ValidationResponse, null, ValidateReqQuery>,
  res: Response<ValidationResponse>,
  next: NextFunction,
) => {
  const { query, extension } = req.query;

  if (!query)
    return res.status(400).json({
      data: {
        extensionId: extension,
      },
      error: true,
      message: "Missing required parameter 'query'.",
      status: 400,
    });

  next();
};

export const validateId = (
  req: Request<null, ValidationResponse, null, ValidateReqId>,
  res: Response<ValidationResponse>,
  next: NextFunction,
) => {
  const { id, extension } = req.query;

  if (!id) {
    res.status(400).json({
      data: {
        extensionId: extension,
      },
      error: true,
      message: `Missing required parameter 'id'`,
      status: 400,
    });
    return;
  }

  next();
};

export const validateExtension = (
  validExtensions: Map<ValidExtensionId, any>,
) => {
  return (
    req: Request<null, ValidationResponse, null, ValidateReqExtension>,
    res: Response<ValidationResponse>,
    next: NextFunction,
  ) => {
    const { extension } = req.query;

    if (!extension) {
      res.status(400).json({
        data: {
          extensionId: extension,
        },
        error: true,
        message: "Missing parameter 'extension'",
        status: 400,
      });
      return;
    }

    const provider = validExtensions.get(extension);

    if (!provider) {
      res.status(400).json({
        data: {
          extensionId: extension,
        },
        error: true,
        message: "Please provide a valid extension",
        status: 400,
      });
      return;
    }

    next();
  };
};
