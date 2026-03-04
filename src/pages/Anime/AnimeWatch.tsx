import { type ChangeEvent, type FC } from "react";
import { useRef, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type {
  Languages,
  Translation,
  ValidExtensionId,
} from "../../../shared-types/extensions";
import PlayerOptions from "../../features/Anime/components/PlayerOptions";
import getHostName from "../../lib/utils/getHostName";
import SimpleError from "../../components/ui/SimpleError";
import RetryButton from "../../components/buttons/RetryButton";
import EpisodeButton from "../../features/Anime/components/EpisodeButton";
import useGetEpisode from "../../features/Anime/hooks/useGetEpisode";
import useGetEpisodeList from "../../features/Anime/hooks/useGetEpisodeList";
import useLocalStorage from "../../lib/hooks/useLocalStorage";
import VideoPlayer from "../../features/Anime/components/VideoPlayer";
import VideoSettings from "../../features/Anime/components/VideoSettings";
import AnimeAdditionalInfo from "../../features/Anime/components/AnimeAdditionalInfo";

type WatchParams = {
  readonly id: string;
  readonly slug: string;
};

type VideoSettings = {
  autoplay: boolean;
  muted: boolean;
  skipIntroOutro: boolean;
  autoNext: boolean;
};

const defaultVideoSettings: VideoSettings = {
  autoplay: true,
  muted: false,
  skipIntroOutro: false,
  autoNext: false,
};

const AnimeWatch: FC = () => {
  const baseURL = getHostName();
  const ls = useLocalStorage();
  const [searchParams] = useSearchParams();
  const params = useParams<WatchParams>();
  const [showId] = useState<string>(searchParams.get("id") as string);
  const [lang, setLang] = useState<Languages>(
    (searchParams.get("lang") as Languages) || "Eng",
  );

  const TEMP = useRef<string>(null);
  const savedVideoSettings = ls.get<VideoSettings>("video-settings").data;
  const videoSettingsRef = useRef<VideoSettings>(
    savedVideoSettings || defaultVideoSettings,
  );
  const [currentEpisode, setCurrentEpisode] = useState<number>(
    Number(searchParams.get("episode")) || 1,
  );
  const [translation, setTranslation] = useState<Translation>(
    (searchParams.get("translation") as Translation) || "sub",
  );
  const [currentServer, setCurrentServer] = useState<string | null>(null);
  const [currentExtension, setCurrentExtension] = useState<ValidExtensionId>(
    (searchParams.get("extension") as ValidExtensionId) || "allanime",
  );

  const {
    data: episodeList,
    isLoading: episodeListIsLoading,
    isError: episodeListHasError,
  } = useGetEpisodeList({
    showId: showId,
    translation: translation,
    lang: lang,
    extension: currentExtension,
    key: [currentServer ? currentServer : "no server"],
  });

  const {
    isError: providerHasError,
    isLoading: providerIsLoading,
    data: provider,
  } = useGetEpisode({
    key: [],
    showId: showId,
    episode: currentEpisode,
    extension: currentExtension,
    translation: translation,
  });

  useEffect(() => {
    if (!currentServer && provider && !provider.error) {
      setCurrentServer(provider.data.sources[0].name);
    }
  }, [provider, currentServer]);

  useEffect(() => {
    if (!episodeList || episodeList.error) return;

    const list = episodeList.data.episodeList.length;

    if (list < currentEpisode) {
      setCurrentEpisode(1);
      window.history.replaceState(
        null,
        "",
        `watch?extension=${currentExtension}&id=${showId}&lang=${lang}&translation=${translation}&episode=1`,
      );
    }
  }, [
    episodeList,
    currentEpisode,
    currentExtension,
    showId,
    lang,
    translation,
  ]);

  return (
    <section
      className="
      rm-scrollbar
    bg-neutral-950 absolute top-10 w-full bottom-0 overflow-auto p-2"
      id="player-section"
    >
      <div className="bg-neutral-900 w-full h-fit flex-col items-center flex lg:h-[105vh] lg:flex-row">
        <div className="rm-scrollbar h-fit w-full lg:w-9/12 lg:h-full">
          {providerHasError && (
            <>
              <div className="p-2 w-full flex h-fit grow-0">
                <div className="bg-neutral-950 aspect-video w-full p-2 relative">
                  <div className="absolute-center flex items-center gap-1 justify-center flex-col">
                    <SimpleError message="Failed to load video. Please try again later" />
                    <RetryButton />
                  </div>
                </div>
              </div>
            </>
          )}
          {!providerHasError && (
            <>
              {providerIsLoading && (
                <>
                  <div className=" w-full flex flex-col h-fit grow-0 p-2">
                    <div className=" bg-neutral-950 aspect-video w-full p-2 relative">
                      <div className="spinner"></div>
                    </div>
                  </div>
                  <div className="w-full px-2 h-8 shrink-0">
                    <div className="w-full h-full rounded-lg skeleton"></div>
                  </div>
                  <div className="w-full p-2 h-14 shrink-0">
                    <div className="w-full h-full rounded-lg skeleton"></div>
                  </div>
                </>
              )}
              {!providerIsLoading && (
                <>
                  <div className="w-full flex h-fit grow-0 p-2">
                    <div className="aspect-video w-full bg-neutral-950">
                      {provider &&
                        (() => {
                          const { sources } = provider.data;
                          const referrer = provider.data.referrer;
                          const server =
                            sources.find(
                              ({ name }) => name === currentServer,
                            ) || sources[0];
                          const url = `${baseURL}/proxy/player?referrer=${referrer}&url=${server.url}`;
                          return (
                            <VideoPlayer
                              {...videoSettingsRef.current}
                              url={url}
                              callback={(vid, { autoNext }) => {
                                if (autoNext)
                                  vid.addEventListener("ended", () => {
                                    let episode: number = currentEpisode;
                                    if (episodeList && !episodeList.error) {
                                      if (
                                        currentEpisode ===
                                        episodeList.data.episodeList.length
                                      )
                                        return;
                                      episode++;
                                    }
                                    setCurrentEpisode(episode);
                                    window.history.replaceState(
                                      null,
                                      "",
                                      `watch?extension=${currentExtension}&id=${showId}&lang=${lang}&translation=${translation}&episode=${episode}`,
                                    );
                                  });
                              }}
                            />
                          );
                        })()}
                    </div>
                  </div>
                  <div className="h-10 px-2 w-full">
                    <VideoSettings
                      {...{ ...videoSettingsRef.current }}
                      callback={(args) => {
                        videoSettingsRef.current = args;
                      }}
                    />
                  </div>
                  <div className="w-full p-2 h-14 shrink-0">
                    <div className="size-full bor bg-neutral-800 rounded-lg flex items-center justify-center p-1">
                      <div className="flex size-full items-center gap-1">
                        <span className="mr-2 font-semibold">Servers:</span>
                        {provider &&
                          (() => {
                            const { sources } = provider.data;

                            return sources.map(({ name }) => {
                              return (
                                <button
                                  onClick={() => setCurrentServer(name)}
                                  key={name}
                                  style={{
                                    ...(currentServer === name && {
                                      backgroundColor: "var(--color-blue-700)",
                                    }),
                                  }}
                                  className="px-2 py-1 bg-neutral-700 rounded-sm cursor-pointer hover:bg-neutral-600"
                                >
                                  {name}
                                </button>
                              );
                            });
                          })()}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {providerHasError && (
            <div className="px-2">
              <SimpleError message="Something went wrong. Please try again later." />
            </div>
          )}

          <aside className="w-full h-35">
            <div className="flex flex-col size-full py-2 gap-2">
              <div className="h-full w-full">
                <PlayerOptions
                  showId={showId}
                  hasError={providerHasError}
                  extension={currentExtension}
                  lang={lang}
                  translation={translation}
                  callback={({ lang, translation, extension }) => {
                    if (lang) setLang(lang);
                    if (translation) setTranslation(translation);
                    if (extension) setCurrentExtension(extension);
                    window.history.replaceState(
                      null,
                      "",
                      `watch?extension=${currentExtension}&id=${showId}&lang=${lang}&translation=${translation}&episode=${currentEpisode}`,
                    );
                  }}
                />
              </div>
            </div>
          </aside>
        </div>
        <aside
          className="w-full p-2 h-[35vh] overflow-hidden flex flex-col relative lg:w-3/12 lg:h-full
        "
        >
          <div className="py-2 px-1 gap-x-2 w-full bg-neutral-950 flex sticky top-0">
            <span>Episodes</span>
            <input
              type="search"
              name="find-episode"
              className="border w-full rounded-sm"
              onChange={(node: ChangeEvent<HTMLInputElement>) => {
                const prevSearch = TEMP.current;
                if (prevSearch) {
                  const button =
                    document?.querySelector(
                      `button[data-episode="${prevSearch}"]`,
                    ) ||
                    document.querySelector(
                      `button[data-episode-title="${prevSearch.toLowerCase()}"]`,
                    );
                  button?.classList.remove("bg-neutral-500!");
                }
                const val = node.target.value;
                TEMP.current = val;
                const button =
                  document?.querySelector(`button[data-episode="${val}"]`) ||
                  document.querySelector(
                    `button[data-episode-title="${val.toLowerCase()}"]`,
                  );
                button?.scrollIntoView({
                  behavior: "smooth",
                });
                button?.classList.add("bg-neutral-500!");
              }}
            />
          </div>

          <div className="h-full overflow-y-auto rm-scrollbar bg-neutral-950">
            {episodeListHasError && (
              <div className="size-full relative">
                <div className="absolute-center w-9/10">
                  <SimpleError message="Failed to load try again later" />
                </div>
              </div>
            )}

            {!episodeListHasError && (
              <div
                id="episode-list-container"
                className="w-full h-fit flex flex-wrap gap-x-2 justify-center"
              >
                {episodeListIsLoading && (
                  <div className="size-full flex flex-col gap-2">
                    {Array.from({ length: 5 }, (_, idx) => (
                      <div
                        key={`div-${idx}`}
                        className="w-full py-5 rounded-md skeleton"
                      ></div>
                    ))}
                  </div>
                )}

                {!episodeListIsLoading && (
                  <>
                    {episodeList?.data.episodeList.map(
                      ({ episodeTitle, episode }) => {
                        const shouldUseGrid: boolean =
                          episodeList.data.episodeList.length >= 40;
                        return (
                          <EpisodeButton
                            episode={episode}
                            disabled={currentEpisode === episode}
                            style={{
                              width: "100%",
                              ...(shouldUseGrid && {
                                width: "52px",
                                borderRadius: "6px",
                              }),
                              ...(episode === currentEpisode && {
                                backgroundColor:
                                  "var(--color-blue-700) !important",
                              }),
                              ...(shouldUseGrid && {
                                margin: "4px 2px",
                              }),
                            }}
                            grid={shouldUseGrid}
                            key={episodeTitle}
                            title={episodeTitle}
                            callback={() => {
                              setCurrentEpisode(episode);
                              window.history.replaceState(
                                null,
                                "",
                                `watch?extension=${currentExtension}&id=${showId}&lang=${lang}&translation=${translation}&episode=${episode}`,
                              );
                            }}
                          />
                        );
                      },
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
      <div className="h-[40vh] w-full mt-2 bg-neutral-900">
        <AnimeAdditionalInfo animeAnlId={Number(params.id)} />
      </div>
    </section>
  );
};

export default AnimeWatch;
