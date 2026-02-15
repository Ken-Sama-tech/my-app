import type {
  ExtensionTypes,
  AnimeExtensions,
  ExtensionsSchema,
} from "../../../../shared-types/extensions";
import axios from "axios";
import getHostName from "../../utils/getHostName";

type Response<T> = {
  data?: T;
  error: boolean;
  message: string;
  status: number;
};

type Filter = {
  type?: ExtensionTypes;
  active?: boolean;
  name?: AnimeExtensions;
};

type FetchExtensionsResponse = Response<ExtensionsSchema[]>;

const baseURL = getHostName();
const extensionURL = `${baseURL}/extensions`;

export const fetchExtensions = async (filter?: Filter) => {
  const { type, active, name } = filter || {};
  try {
    const res = await axios.get<FetchExtensionsResponse>(extensionURL, {
      params: {
        ...(type && { type }),
        ...(active !== undefined && { active }),
        ...(name && { name }),
      },
    });

    return res.data;
  } catch (e: any) {
    return {
      data: [],
      error: true,
      message: e?.message || e,
      status: e?.status || 400,
    };
  }
};
