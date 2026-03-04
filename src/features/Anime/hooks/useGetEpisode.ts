import { fetchEpisode } from "../../../lib/api/anime";
import type {
  Id,
  Translation,
  ValidExtensionId,
} from "../../../../shared-types/extensions";
import { useEffect, useState } from "react";

type FetchEpisodeResult = Awaited<ReturnType<typeof fetchEpisode>>;

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
    } & IfNotError<Extract<FetchEpisodeResult, { error: false }>>);

type Args = {
  showId: Id;
  extension?: ValidExtensionId;
  translation?: Translation;
  episode?: number;
  key: string[];
};

const useGetEpisode = (args: Args): Response => {
  const { showId, extension, translation, key, episode = 1 } = args;
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
        const response = await fetchEpisode({
          id: showId,
          episode,
          ...(extension && { extension }),
          ...(translation && { translation }),
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
  }, [episode, translation, extension, showId, ...key]);

  return result;
};

export default useGetEpisode;
