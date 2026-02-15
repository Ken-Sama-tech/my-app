import type { ObjectId } from "mongoose";
import type { ExtensionsFields } from "./extensions.type";
import type { UpdateExtensionsResBody } from "../../../../shared-types/controllers";
import axios from "axios";
import getHostName from "../../utils/getHostName";

const baseURL = getHostName();
const extensionURL = `${baseURL}/extensions/update`;

type UpdateExtensionsResponse = {
  -readonly [K in keyof UpdateExtensionsResBody]: UpdateExtensionsResBody[K];
};

export const updateExtensions = async (
  id: ObjectId,
  fields: ExtensionsFields,
): Promise<UpdateExtensionsResponse> => {
  try {
    if (!id) throw new Error("Required missing parameter 'id'");

    const response = await axios.patch<UpdateExtensionsResponse>(
      `${extensionURL}/${id}`,
      fields,
    );

    return response.data;
  } catch (e: any) {
    return {
      acknowledged: false,
      error: true,
      message: e.message || e,
      status: e.status || 400,
    };
  }
};
