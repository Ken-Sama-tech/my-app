import type { ExtensionTypes } from "../../../server/models/types/Extensions";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { ExtensionsResponse } from "../../../server/models/types/Extensions";

type UseExtensions = (type?: ExtensionTypes | null) => {
  data?: ExtensionsResponse[];
  isError: boolean;
  isLoading: boolean;
};

const useExtensions: UseExtensions = (type = null) => {
  const {
    data: extensions,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["extensions"],
    queryFn: () =>
      axios.get<ExtensionsResponse[]>(
        `${import.meta.env.VITE_API_URL}/extensions${
          type ? `?type=${type}` : ""
        }`
      ),
  });

  return { data: extensions?.data, isLoading, isError };
};

export default useExtensions;
