import { useCallback, type FC } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import anilist from "../../lib/api/anilist/anilist";
import MediaCard from "../../components/cards/MediaCard";
import type { AnilistMediaQueryResponse } from "../../pages/Anime/types/anime";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import formatDate from "../../lib/utils/formatDate";
import SimpleError from "../../components/ui/SimpleError";
import { MoveLeft } from "lucide-react";

const queryData: string[] = [
  "id",
  "idMal",
  "title {english native romaji}",
  "coverImage { extraLarge }",
  "meanScore",
  "status",
  "genres",
  "format",
  "description",
  "bannerImage",
  "updatedAt",
  "episodes",
  "duration",
  "nextAiringEpisode { timeUntilAiring }",
];

const media = (id: number) =>
  anilist().media<AnilistMediaQueryResponse>(
    {
      id,
    },
    queryData
  );

const AnimeDetail: FC = () => {
  const params = useParams();
  const id = Number(params.id);

  const { data, isError, isLoading } = useQuery({
    queryKey: [`anime-${id}`],
    queryFn: () => media(id).query(),
  });

  const anime = data?.data?.Media;
  let durationTilNextEP = anime?.nextAiringEpisode?.timeUntilAiring || 0;
  const nextEpisodeRef = useCallback(
    (node: HTMLSpanElement) => {
      if (!node || !durationTilNextEP) return;

      let timer: number = window.setInterval(() => {
        node.textContent = `Next episode in: ${formatDate(
          durationTilNextEP,
          "duration"
        )}`;
        durationTilNextEP--;
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    },
    [isLoading, durationTilNextEP]
  );

  return (
    <>
      <section className="flex items-start w-full h-[70vh] sm:h-[65vh] bg-neutral-900 shadow-2xl z-0">
        {!isError && (
          <>
            {!isLoading && (
              <>
                <div className="relative flex flex-col items-end size-full z-0">
                  <Link className="absolute z-1 size-10 left-1" to={"/anime"}>
                    <MoveLeft color="#1447e6" className="size-full" />
                  </Link>
                  <div
                    style={{ backgroundImage: `url(${anime?.bannerImage})` }}
                    className="w-full aspect-14/3 flex relative bg-no-repeat bg-cover overflow-visible bg-neutral-950"
                  >
                    {!anime?.bannerImage && (
                      <div className="absolute size-full flex items-center justify-center">
                        <SimpleError message="Banner not available" />
                      </div>
                    )}
                    <Link
                      target="_blank"
                      to={anime?.coverImage?.extraLarge || "#"}
                      className="block absolute top-[120%] z-1 sm:top-2/3 md:top-1/2 left-4"
                    >
                      <MediaCard
                        src={anime?.coverImage?.extraLarge}
                        isLoading={false}
                        effects={false}
                        height={230}
                        width={160}
                      />
                    </Link>
                  </div>
                  <div className="relative size-full">
                    <div className="absolute w-full md:w-6/10 lg:w-10/12 h-full md:left-[190px] grid grid-cols-6 grid-rows-6 items-start p-2">
                      <div className="w-full flex gap-1 py-0.5 flex-wrap md:flex-nowrap md:overflow-x-auto col-span-3 col-start-1 row-span-2 col-end-4 row-start-6 row-end-6 md:col-span-6 md:row-span-1 md:row-start-1 rm-scrollbar sm:col-end-3">
                        <Badge className="!px-2 !py-0.5 text-sm h-fit text-nowrap grow-0">
                          {anime?.status || "unknown"}
                        </Badge>
                        <Badge className="!px-2 !py-0.5 text-sm h-fit text-nowrap grow-0">
                          {"Eps: " + (anime?.episodes || "null")}
                        </Badge>
                        <Badge className="!px-2 !py-0.5 text-sm h-fit text-nowrap grow-0">
                          {anime?.format || "unknown"}
                        </Badge>
                        <Badge className="!px-2 !py-0.5 text-sm h-fit text-nowrap grow-0">
                          {anime?.duration
                            ? anime.duration + " mins"
                            : "duration: uknown"}
                        </Badge>
                        <Badge className="!px-2 !py-0.5 text-sm h-fit text-nowrap grow-0">
                          {(Number(anime?.meanScore) * 0.1).toFixed(1) || 0}
                        </Badge>
                      </div>
                      <div className="grow h-full overflow-hidden flex col-span-4 col-start-4 row-span-6 md:col-span-6 md:row-span-5 md:row-start-2 sm:col-span-4 ">
                        <div className="h-full w-full flex flex-col md:flex-row gap-0.5">
                          <div className="w-full md:w-1/2 h-full p-1 text-md">
                            <h2 className="text-md font-medium">
                              {(() => {
                                const title = anime?.title;
                                return (
                                  title?.english ||
                                  title?.romaji ||
                                  title?.native
                                );
                              })()}
                            </h2>
                            <div className="text-sm grid grid-cols-1 w-full">
                              <span className="italic">
                                Romaji: {anime?.title.romaji}
                              </span>
                              <span className="italic">
                                Native: {anime?.title.native}
                              </span>
                              <span className="italic">
                                Updated at: {formatDate(anime?.updatedAt || 0)}
                              </span>
                              <span className="italic" ref={nextEpisodeRef}>
                                Next episode at: 00:00:00:00
                              </span>
                              <span className="italic text-wrap flex flex-wrap shrink-0 gap-1">
                                Genres:
                                {anime?.genres?.map((genre, idx) => {
                                  if (
                                    anime.genres?.length &&
                                    anime.genres.length - 1 === idx
                                  )
                                    return (
                                      <span key={genre + idx}>{genre}</span>
                                    );
                                  return (
                                    <span key={genre + idx}>{genre}, </span>
                                  );
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="w-full md:w-1/2 h-full p-1">
                            <span className="font-medium">Synopsis: </span>
                            <div className="h-full p-1 block overflow-auto rm-scrollbar">
                              <p
                                className="size-full text-sm"
                                ref={(node: HTMLParagraphElement) => {
                                  if (!node) return;
                                  node.innerHTML = anime?.description || "";
                                }}
                              ></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isLoading && (
              <div className="size-full p-1 h-[75vh] md:h-[65vh] flex flex-col items-end">
                <Link className="absolute z-1 size-10 left-1" to={"/anime"}>
                  <MoveLeft color="#1447e6" className="size-full" />
                </Link>
                <div className="!w-full !h-fit !aspect-14/3 bg-no-repeat bg-cover rounded-lg skeleton-text relative !overflow-visible">
                  <div className="aspect-2/3 z-2 rounded-lg skeleton absolute top-[120%] md:top-1/2 left-2 h-[230px]"></div>
                </div>

                <div className="size-full relative">
                  <div className="h-full absolute z-1 grid w-full grid-cols-6 grid-rows-6 bg-neutral-950">
                    <div className="col-span-3 row-span-1 col-start-1 col-end-4 row-start-6 md:col-start-3 lg:col-start-2 md:col-span-6 md:row-start-1 flex gap-x-0.5 items-center px-1 flex-wrap h-fit">
                      <span className="skeleton-text h-5 w-12 rounded-full shrink-0"></span>
                      <span className="skeleton-text h-5 w-12 rounded-full shrink-0"></span>
                      <span className="skeleton-text h-5 w-12 rounded-full shrink-0"></span>
                      <span className="skeleton-text h-5 w-12 rounded-full shrink-0"></span>
                      <span className="skeleton-text h-5 w-12 rounded-full shrink-0"></span>
                    </div>
                    <div className="col-span-6 col-start-4 md:col-start-3 lg:col-start-2 row-span-6 row-start-1 md:row-start-2 flex flex-col md:flex-row">
                      <div className="w-full md:w-1/2 flex gap-y-0.5 flex-col p-1">
                        <span className="skeleton-text rounded-full w-25 h-5"></span>
                        <div className="w-full h-fit flex flex-col skeleton grow rounded-lg p-1">
                          <span className="skeleton-text rounded-full h-5 w-30"></span>
                          <span className="skeleton-text rounded-full h-5 w-full"></span>
                          <span className="skeleton-text rounded-full h-5 w-9/10"></span>
                          <span className="skeleton-text rounded-full h-5 w-1/2"></span>
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 grow flex gap-y-0.5 flex-col p-1">
                        <span className="skeleton-text rounded-full w-25 h-5"></span>
                        <div className="w-full flex flex-col skeleton grow rounded-lg p-1">
                          <span className="skeleton-text rounded-full h-5 w-1/2"></span>
                          <span className="skeleton-text rounded-full h-5 w-9/10"></span>
                          <span className="skeleton-text rounded-full h-5 w-10/10"></span>
                          <span className="skeleton-text rounded-full h-5 w-1/3"></span>
                          <span className="skeleton-text rounded-full h-5 w-9/10 block md:hidden"></span>
                          <span className="skeleton-text rounded-full h-5 w-9/10 block md:hidden"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {isError && (
          <div className="h-full w-full flex justify-center items-center">
            <div className="w-2/5 h-fit">
              <SimpleError message="HTTP 500. Probably CORS, try again in a few minutes." />
            </div>
          </div>
        )}
      </section>
      <section className="w-full h-full bg-red-400"></section>
    </>
  );
};

export default AnimeDetail;
