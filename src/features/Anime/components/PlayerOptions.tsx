import type {
  Id,
  Sub,
  Dub,
  Languages,
  Translation,
  ValidExtensionId,
} from "../../../../shared-types/extensions/index";
import { Mic, ClosedCaption } from "lucide-react";
import type { FC } from "react";
import useGetTranslations from "../hooks/useGetTranslations";
import SimpleError from "../../../components/ui/SimpleError";

type PlayerOptionsCallbackArgs = {
  lang: Languages;
  translation: Translation;
  extension?: ValidExtensionId;
};

type PlayerOptionsProps = {
  showId: Id;
  extension: ValidExtensionId;
  lang: Languages;
  translation: Translation;
  hasError?: boolean;
  callback?: (args: PlayerOptionsCallbackArgs) => void;
};

const PlayerOptions: FC<PlayerOptionsProps> = ({
  showId,
  extension,
  lang,
  hasError = false,
  translation,
  callback,
}) => {
  const {
    data: response,
    isLoading,
    isError,
  } = useGetTranslations({
    showId,
    extension,
    key: ["available-translations"],
  });

  return (
    <div className="size-full flex">
      {!isError && !hasError && (
        <>
          {isLoading && (
            <div className="size-full flex justify-center items-center p-2">
              <div className="size-full skeleton rounded-lg"></div>
            </div>
          )}
          {!isLoading && (
            <>
              <div className="size-full flex flex-col items-center justify-start py-2 gap-2">
                <div className="h-full flex justify-center items-center w-full px-2">
                  <div className="size-full flex flex-col justify-center items-center bg-neutral-800 rounded-lg p-1">
                    <div className="w-full h-[48%] flex gap-1">
                      <div className="w-fit mr-2 h-full flex items-center gap-0.5">
                        <ClosedCaption className="h-1/3" />
                        <span className="text-sm font-semibold">SUB:</span>
                      </div>
                      <div className="grow h-full rounded-lg flex items-center justify-start px-2">
                        {response.data?.subs.map((sub: Sub) => {
                          const hasEpisodes = sub.episodes >= 1;
                          const active =
                            lang === sub.lang && translation === "sub";

                          return (
                            <button
                              {...(!hasEpisodes && { disabled: true })}
                              {...(active && {
                                disabled: true,
                              })}
                              style={{
                                ...(!hasEpisodes && {
                                  backgroundColor: "var(--color-neutral-500)",
                                }),
                                ...(active && {
                                  backgroundColor: "var(--color-blue-700)",
                                }),
                              }}
                              onClick={() => {
                                if (callback)
                                  callback({
                                    lang: sub.lang,
                                    translation: "sub",
                                  });
                              }}
                              key={`${showId}-${sub}-${lang}`}
                              className="bg-neutral-700 px-4 py-1 rounded-sm cursor-pointer select-none transition-all duration-200 hover:bg-neutral-500"
                            >
                              {sub.lang}: {sub.episodes}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="my-0.5 bg-neutral-400 w-[98%] h-0.5 rounded-full"></div>
                    <div className="w-full h-[48%] flex gap-1">
                      <div className="flex h-full items-center w-fit mr-2 gap-0.5">
                        <Mic className="h-1/3" />
                        <span className="text-sm font-semibold">DUB:</span>
                      </div>
                      <div className="grow h-full rounded-lg flex items-center justify-start px-2">
                        {!response.error &&
                          response.data?.dubs?.map((dub: Dub) => {
                            const hasEpisodes = dub.episodes >= 1;
                            const active =
                              lang === dub.lang && translation === "dub";
                            return (
                              <button
                                {...(!hasEpisodes && { disabled: true })}
                                {...(active && { disabled: true })}
                                style={{
                                  ...(!hasEpisodes && {
                                    backgroundColor: "var(--color-neutral-500)",
                                  }),
                                  ...(active && {
                                    backgroundColor: "var(--color-blue-700)",
                                  }),
                                }}
                                onClick={() => {
                                  if (callback)
                                    callback({
                                      lang: dub.lang,
                                      translation: "dub",
                                    });
                                }}
                                key={`${showId}-${dub}-${lang}`}
                                className="bg-neutral-700 px-4 py-1 rounded-sm cursor-pointer select-none transition-all duration-200  hover:bg-neutral-500"
                              >
                                {dub.lang}: {dub.episodes}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {(isError || hasError) && (
        <>
          <div className="size-full p-2">
            <div className="flex rounded-md justify-center items-center size-full bg-neutral-800">
              <div className="">
                <SimpleError message="Something went wrong. Please try again later." />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerOptions;
