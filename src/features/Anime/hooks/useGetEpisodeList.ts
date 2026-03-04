import { fetchEpisodeList } from "../../../lib/api/anime";
import type {
  Id,
  Languages,
  Translation,
  ValidExtensionId,
} from "../../../../shared-types/extensions";
import { useEffect, useState } from "react";

type FetchEpisodeListResult = Awaited<ReturnType<typeof fetchEpisodeList>>;

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
    } & IfNotError<Extract<FetchEpisodeListResult, { error: false }>>);

type Args = {
  showId: Id;
  extension?: ValidExtensionId;
  lang?: Languages;
  translation?: Translation;
  key?: string[];
};

const useGetEpisodeList = (args: Args): Response => {
  const { showId, extension, key = [], lang, translation } = args;
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
        const response = await fetchEpisodeList({
          id: showId,
          lang,
          translation,
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
  }, [...key, showId, extension, translation, lang]);

  return result;
};

export default useGetEpisodeList;
