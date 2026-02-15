import { type FC } from "react";
import { useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import anilist from "../../lib/api/anilist/anilist";
import {
  fetchEpisodeList,
  fetchEpisode,
  fetchTranslations,
} from "../../lib/api/anime";
import type {
  AnimeExtensions,
  Languages,
  Translation,
  EpisodeList,
  Id,
  Sub,
  Dub,
} from "../../../shared-types/extensions";
import { Mic, ClosedCaption } from "lucide-react";
import getHostName from "../../lib/utils/getHostName";
import SimpleError from "../../components/ui/SimpleError";
import RetryButton from "../../components/buttons/RetryButton";
// import userInteracted from "../../lib/utils/userInteracted";

type WatchParams = {
  readonly id: string;
  readonly slug: string;
};

type PlayerOptionsCallbackArgs = {
  lang: Languages;
  translation: Translation;
  extension?: AnimeExtensions;
};

type PlayerOptionsProps = {
  showId: Id;
  extension: AnimeExtensions;
  lang: Languages;
  translation: Translation;
  callback?: (args: PlayerOptionsCallbackArgs) => void;
};

const PlayerOptions: FC<PlayerOptionsProps> = ({
  showId,
  extension,
  lang,
  translation,
  callback,
}) => {
  const availableTransations =
    useRef<Awaited<ReturnType<typeof fetchTranslations>>["data"]>(null);
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["available-translations", showId],
    queryFn: () =>
      fetchTranslations({
        id: showId,
        extension,
      }),
  });

  if (response?.data) availableTransations.current = response.data;

  return (
    <div className="bg-neutral-900 size-full flex">
      {!isError && (
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
                  <div className="w-2/10 h-full rounded-tl-xl rounded-bl-xl bg-blue-700"></div>
                  <div className="h-full w-8/10 flex flex-col justify-center items-center bg-neutral-800 rounded-tr-xl rounded-br-xl p-1">
                    <div className="w-full h-[48%] flex gap-1">
                      <div className="w-2/12 h-full flex items-center gap-0.5">
                        <ClosedCaption className="h-1/3" />
                        <span className="text-sm font-semibold">SUB:</span>
                      </div>
                      <div className="w-10/12 h-full rounded-lg flex items-center justify-start px-2">
                        {availableTransations.current?.subs?.map((sub: Sub) => {
                          const hasEpisodes = sub.episodes >= 1;
                          return (
                            <button
                              {...(!hasEpisodes && { disabled: true })}
                              style={{
                                ...(!hasEpisodes && {
                                  backgroundColor: "var(--color-neutral-500)",
                                }),
                                ...(lang === sub.lang &&
                                  translation === "sub" && {
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
                              className="bg-neutral-700 px-4 py-1 rounded-sm cursor-pointer select-none transition-all duration-200"
                            >
                              {sub.lang}: {sub.episodes}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="my-0.5 bg-neutral-400 w-[98%] h-0.5 rounded-full"></div>
                    <div className="w-full h-[48%] flex gap-1">
                      <div className="flex h-full items-center w-2/12 gap-0.5">
                        <Mic className="h-1/3" />
                        <span className="text-sm font-semibold">DUB:</span>
                      </div>
                      <div className="w-10/12 h-full rounded-lg flex items-center justify-start px-2">
                        {availableTransations.current?.dubs?.map((dub: Dub) => {
                          const hasEpisodes = dub.episodes >= 1;
                          return (
                            <button
                              {...(!hasEpisodes && { disabled: true })}
                              style={{
                                ...(!hasEpisodes && {
                                  backgroundColor: "var(--color-neutral-500)",
                                }),
                                ...(lang === dub.lang &&
                                  translation === "dub" && {
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
                              className="bg-neutral-700 px-4 py-1 rounded-sm cursor-pointer select-none transition-all duration-200"
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
    </div>
  );
};

const anl = anilist();
const queryData: string[] = ["idMal", "title { romaji english native}"];

const AnimeWatch: FC = () => {
  const baseURL = getHostName();
  const [searchParams] = useSearchParams();
  const params = useParams<WatchParams>();
  const id = params.id;
  const showId = searchParams.get("id") as string;

  const episodeRef = useRef<number>(
    (Number(searchParams.get("episode")) as number) || 1,
  );

  const videoPlayerContainerRef = useRef<HTMLDivElement>(null);
  const videoSettingsContainerRef = useRef<HTMLDivElement>(null);
  const videoServer = useRef<string>(null);
  const extensionRef = useRef<AnimeExtensions>(
    (searchParams.get("extension") as AnimeExtensions) || "allanime",
  );
  const translationRef = useRef<Translation>(
    (searchParams.get("translation") as Translation) || "sub",
  );
  const langRef = useRef<Languages>(
    (searchParams.get("lang") as Languages) || "Eng",
  );
  const episodeList = useRef<EpisodeList[]>([]);

  const {} = useQuery({
    queryKey: ["watch"],
    queryFn: () =>
      anl
        .media(
          {
            id: Number(id),
          },
          queryData,
        )
        .query(),
  });

  const {
    data: provider,
    isLoading: providerIsLoading,
    isError: providerHasError,
    refetch,
  } = useQuery({
    queryKey: ["episode", showId, langRef.current],
    queryFn: () =>
      (async () => {
        const lang = langRef.current;
        const extension = extensionRef.current;
        const translation = translationRef.current;
        const episode = episodeRef.current;

        const { data: eps } = await fetchEpisodeList({
          id: showId,
          ...(extension && { extension }),
          ...(translation && { translation }),
          ...(lang && { lang }),
        });

        episodeList.current = eps?.episodeList || [];

        if (episode > episodeList.current.length) episodeRef.current = 1;

        const response = await fetchEpisode({
          id: showId,
          ...(extension && { extension }),
          ...(episode && { episode }),
          ...(translation && { translation }),
        });

        return response;
      })(),
  });

  const videoPlayer = useCallback(() => {
    const playerContainer = videoPlayerContainerRef.current;
    const settingsContainer = videoSettingsContainerRef.current;
    if (!provider?.data) return;
    const anime = provider.data;

    if (!playerContainer) return;
    if (!anime.sources) return;

    const { referrer, sources } = anime;
    const defaultServer = sources[0];
    const source = videoServer.current
      ? sources.find(({ name }) => name === videoServer.current) ||
        defaultServer
      : defaultServer;

    videoServer.current = source.name;

    const url = `${baseURL}/proxy/player?referrer=${referrer}&url=${source?.url}`;
    const videoElem = document.createElement("video");
    const sourceElem = document.createElement("source");

    videoElem.className = "aspect-video w-full";
    videoElem.muted = true;
    videoElem.controls = true;
    videoElem.autoplay = true;
    sourceElem.src = url;
    sourceElem.type = "video/mp4";

    playerContainer.innerHTML = "";

    const onWheel = () => null;
    const unMute = () => {
      videoElem.muted = false;
    };

    // const changeState = (e: Event) => {
    //   () => {
    //     e.preventDefault();
    //     const interacted = userInteracted();
    //     if (!interacted) return;
    //     videoElem.addEventListener("playing", unMute);
    //     const visible = document.hidden;
    //     if (visible) videoElem.play();
    //     else videoElem.pause();
    //   };
    // };

    videoElem.addEventListener("wheel", onWheel, { passive: true });
    videoElem.addEventListener("playing", unMute);
    // document.addEventListener("visibilitychange", changeState);

    videoElem.appendChild(sourceElem);
    playerContainer?.appendChild(videoElem);

    if (settingsContainer) {
      settingsContainer.innerHTML = "";
      const wrapper = document.createElement("div");
      const span = document.createElement("span");

      wrapper.className = "flex size-full items-center gap-1";
      span.textContent = "Servers:";
      settingsContainer.appendChild(wrapper);
      wrapper.appendChild(span);
      sources.forEach((source) => {
        const button = document.createElement("button");
        button.className = "px-3 h-full rounded-md ";
        button.textContent = source.name;

        if (source.name === videoServer.current)
          button.classList.add("bg-blue-700");
        else button.classList.add("bg-neutral-700");
        button.onclick = () => {
          videoServer.current = source.name;
          videoPlayer();
        };
        wrapper.appendChild(button);
      });
    }

    return () => {
      videoElem.removeEventListener("wheel", onWheel);
      videoElem.removeEventListener("playing", unMute);
      // document.removeEventListener("visibilitychange", changeState);
    };
  }, [provider?.data]);

  return (
    <section
      className="
      rm-scrollbar
    bg-neutral-900 absolute top-10 p-5 w-full bottom-0 overflow-auto"
      id="player-section"
    >
      <div className="w-full h-fit flex-col flex gap-x-5 lg:h-dvh lg:flex-row">
        <div className="rm-scrollbar h-fit w-full lg:w-9/12 lg:h-full">
          {providerHasError && (
            <>
              <div className="w-full flex h-fit grow-0">
                <div className="aspect-video w-full p-2 bg-neutral-950 relative">
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
                  <div className="w-full flex flex-col h-fit grow-0">
                    <div className="aspect-video w-full p-2 bg-neutral-950 relative">
                      <div className="spinner"></div>
                    </div>
                  </div>
                  <div className="w-full p-2 h-14 shrink-0">
                    <div className="w-full h-full rounded-lg skeleton"></div>
                  </div>
                </>
              )}
              {!providerIsLoading && (
                <>
                  <div className="w-full flex h-fit grow-0">
                    <div
                      ref={videoPlayerContainerRef}
                      className="aspect-video w-full p-2 bg-neutral-950"
                    ></div>
                  </div>
                  <div ref={videoPlayer} className="w-full p-2 h-14 shrink-0">
                    <div
                      ref={videoSettingsContainerRef}
                      className="size-full bg-neutral-800 rounded-lg flex items-center justify-center p-1"
                    ></div>
                  </div>
                </>
              )}
            </>
          )}

          <aside className="w-full h-35">
            <div className="flex flex-col size-full py-2 gap-2">
              <div className="h-full w-full">
                <PlayerOptions
                  showId={showId}
                  extension={extensionRef.current}
                  lang={langRef.current}
                  translation={translationRef.current}
                  callback={({ lang, translation, extension }) => {
                    if (lang) langRef.current = lang;
                    if (translation) translationRef.current = translation;
                    if (extension) extensionRef.current = extension;
                    refetch();
                    videoPlayer();
                    window.history.replaceState(
                      null,
                      "",
                      `watch?extension=${extensionRef.current}&id=${showId}&lang=${langRef.current}&translation=${translationRef.current}&episode=${episodeRef.current}`,
                    );
                  }}
                />
              </div>
            </div>
          </aside>
        </div>
        <aside
          className="w-full h-[35vh] bg-neutral-800 p-2 overflow-hidden flex flex-col lg:w-3/12 lg:h-full
        "
        >
          <div className="py-2 bg-neutral-900 px-2 flex gap-2">
            <span>Episodes</span>
            <input
              type="search"
              name="find-episode"
              className="border w-full rounded-sm"
            />
          </div>

          <div className="size-full flex flex-col overflow-y-auto rm-scrollbar">
            {episodeList.current.map((ep) => {
              return (
                <button
                  style={{
                    ...(ep.episode === episodeRef.current && {
                      backgroundColor: "var(--color-blue-700)",
                    }),
                  }}
                  key={ep.episodeTitle}
                  className="w-full py-2 text-center bg-neutral-700 cursor-pointer hover:bg-neutral-500"
                  onClick={() => {
                    episodeRef.current = ep.episode;
                    refetch();
                    window.history.replaceState(
                      null,
                      "",
                      `watch?extension=${extensionRef.current}&id=${showId}&lang=${langRef.current}&translation=${translationRef.current}&episode=${episodeRef.current}`,
                    );
                  }}
                >
                  {ep.episodeTitle}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default AnimeWatch;
