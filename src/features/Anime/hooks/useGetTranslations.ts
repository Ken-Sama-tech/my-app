import { fetchTranslations } from "../../../lib/api/anime";
import type { Id, ValidExtensionId } from "../../../../shared-types/extensions";
import { useEffect, useState } from "react";

type FetchTranslationResult = Awaited<ReturnType<typeof fetchTranslations>>;

type IfNotError<T> =
  | {
      isLoading: true;
      data: null;
    }
  | {
      isLoading: false;
      data: T;
    };

type Response =
  | {
      isError: true;
      isLoading: false;
      data: null;
    }
  | ({
      isError: false;
    } & IfNotError<Extract<FetchTranslationResult, { error: false }>>);

type Args = {
  showId: Id;
  extension?: ValidExtensionId;
  key: string[];
};

const useGetTranslations = (args: Args): Response => {
  const { showId, extension, key } = args;
  const [result, setResult] = useState<Response>({
    isError: false,
    isLoading: true,
    data: null,
  });

  useEffect(() => {
    setResult({
      isError: false,
      isLoading: true,
      data: null,
    });
    (async () => {
      try {
        const response = await fetchTranslations({
          id: showId,
          extension,
        });

        if (response.error) {
          setResult({
            isError: true,
            isLoading: false,
            data: null,
          });
          return;
        }

        setResult({
          isError: false,
          isLoading: false,
          data: response,
        });
      } catch (error) {
        setResult({
          isError: true,
          isLoading: false,
          data: null,
        });
      }
    })();
  }, [showId, ...key]);

  return result;
};

export default useGetTranslations;
