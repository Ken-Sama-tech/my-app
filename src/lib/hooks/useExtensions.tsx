import type { ExtensionTypes } from "../../../server/models/types/Extensions";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  ExtensionsResponse,
  ExtensionsSchema,
} from "../../../server/models/types/Extensions";
import useServerConfig from "./useServerConfig";
import type { ObjectId } from "mongoose";

export type GetExtensionsResponse = {
  data: ExtensionsResponse[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export type UpdateExtensionResponse = {
  isError: boolean;
  isPending: boolean;
  isSuccess: boolean;
};

type ExtensionFields = {
  [K in keyof ExtensionsSchema]?: ExtensionsSchema[K];
};

type UpdateExtension = (
  base: string,
  id: ObjectId,
  data: ExtensionFields
) => UpdateExtensionResponse;

type GetExtensions = (
  base: string,
  type: ExtensionTypes | null
) => GetExtensionsResponse;

type UseExtensions = (type?: ExtensionTypes | null) => {
  getExtensions: () => GetExtensionsResponse;
  updateExtension: (
    id: ObjectId,
    data: ExtensionFields
  ) => UpdateExtensionResponse;
};

const getExtensions: GetExtensions = (base, type) => {
  const qKeys = ["extensions"];

  if (type) qKeys.push(type);

  const {
    data: extensions,
    isError,
    isLoading,
  } = useQuery({
    queryKey: qKeys,
    queryFn: () =>
      axios.get<ExtensionsResponse[]>(
        `${base}/extensions${type ? `?type=${type}` : ""}`
      ),
  });

  return { data: extensions?.data, isError, isLoading };
};

const updateExtension: UpdateExtension = (base, id, data) => {
  const { isPending, isSuccess, isError } = useMutation({
    mutationFn: () =>
      axios.post(`${base}/extensions/update/${id}`, JSON.stringify(data)),
  });

  return { isPending, isSuccess, isError };
};

const useExtensions: UseExtensions = (type = null) => {
  const serverConfig = useServerConfig();
  const base = serverConfig.getServerUrl;

  return {
    getExtensions: () => getExtensions(base, type),
    updateExtension: (id, data) => updateExtension(base, id, data),
  };
};

export default useExtensions;
