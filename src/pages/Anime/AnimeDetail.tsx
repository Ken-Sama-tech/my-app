import { useCallback, useEffect, type FC } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import anilist from "../../lib/api/anilist/anilist";
import MediaCard from "../../components/cards/MediaCard";
import type { AnilistMediaQueryResponse } from "./types/anime";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import formatDate from "../../lib/utils/formatDate";
import SimpleError from "../../components/ui/SimpleError";
import { MoveLeft } from "lucide-react";
import AddToLibraryToggle from "../../components/checkboxes/AddToLibrarytoggle";
import AnimeExtensionsResults from "../../features/Anime/components/AnimeExtensionsResults";
import slugify from "../../lib/utils/slugify";

const queryData: string[] = [
  "id",
  "idMal",
  "title {english native romaji}",
  "coverImage { extraLarge }",
  "meanScore",
  "status",
  "genres",
  "tags { name id}",
  "format",
  "description",
  "bannerImage",
  "episodes",
  "duration",
  "nextAiringEpisode { timeUntilAiring }",
];

const media = (id: number) =>
  anilist().media<AnilistMediaQueryResponse>(
    {
      id,
    },
    queryData,
  );

type AnimeDetailParams = {
  readonly slug: string;
  readonly id: string;
};

const AnimeDetail: FC = () => {
  const params = useParams<AnimeDetailParams>();
  const slug = params.slug;
  const id = Number(params.id);

  const {
    data: mediaQuery,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["anime", id, slug],
    queryFn: () => media(id).query(),
  });

  const { data } = mediaQuery || {};

  const titles = data?.Media.title;
  const title = titles?.romaji || titles?.english || titles?.native;
  const idMal = data?.Media.idMal;

  useEffect(() => {
    if (!slug && title) {
      // window.history.replaceState(null, "", `/anime/${id}/${slugify(title)}`);
      window.location.href = `/anime/${id}/${slugify(title)}`;
    }
  }, [title]);

  const anime = data?.Media;

  let durationTilNextEP = anime?.nextAiringEpisode?.timeUntilAiring || 0;

  const nextEpisodeRef = useCallback(
    (node: HTMLSpanElement) => {
      if (!node || !durationTilNextEP) return;

      let timer: number = window.setInterval(() => {
        node.textContent = formatDate(durationTilNextEP, "duration");
        durationTilNextEP--;
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    },
    [isLoading, durationTilNextEP],
  );

  return (
    <>
      <section className="flex items-start w-full h-[75vh] sm:h-[65vh] bg-neutral-900 shadow-2xl z-0">
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
                      className="block absolute top-[120%] z-1 sm:top-2/3 md:top-1/2 left-2.5"
                    >
                      <MediaCard
                        src={anime?.coverImage?.extraLarge}
                        isLoading={false}
                        effects={false}
                        height={230}
                        width={160}
                      />
                      <div className="absolute w-full h-8 mt-1">
                        <AddToLibraryToggle />
                      </div>
                    </Link>
                  </div>
                  <div className="relative size-full">
                    <div className="absolute w-fit h-full md:right-0 md:left-47.5">
                      <div className="size-full relative grid grid-cols-6 grid-rows-7 items-start">
                        <div className="w-full absolute bottom-2 flex gap-1 py-0.5 flex-wrap md:flex-nowrap md:overflow-x-auto col-span-4 col-start-1 row-span-2 col-end-4 row-start-7 row-end-7 md:col-span-7 md:col-start-1 md:relative md:bottom-0 md:row-span-1 md:row-start-1 rm-scrollbar sm:col-end-3">
                          <Badge className="px-2! py-0.5! shrink text-sm h-fit text-nowrap grow-0">
                            {"Score: " +
                              (Number(anime?.meanScore) * 0.1).toFixed(1) || 0}
                          </Badge>
                          <Badge className="px-2! py-0.5! shrink text-sm h-fit text-nowrap grow-0">
                            {"Eps: " + (anime?.episodes || "??")}
                          </Badge>
                          <Badge className="px-2! py-0.5! shrink text-sm h-fit text-nowrap grow-0">
                            {anime?.format || "format??"}
                          </Badge>
                          <Badge className="px-2! py-0.5! shrink text-sm h-fit text-nowrap grow-0">
                            {anime?.duration
                              ? anime.duration + " mins"
                              : "duration??"}
                          </Badge>
                          <Badge className="px-2! py-0.5! shrink text-sm h-fit text-nowrap grow-0">
                            {anime?.status || "unknown"}
                          </Badge>
                        </div>
                        <div className="w-full h-full overflow-hidden flex col-span-4 col-start-4 row-span-7 row-start-1 md:col-span-7 md:row-span-6 md:row-start-2 sm:col-start-3 sm:col-span-5 ">
                          <div className="h-full w-full flex flex-col md:flex-row gap-0.5">
                            <div className="h-4/6 overflow-y-auto w-full md:w-1/2 md:h-full p-1 text-md rm-scrollbar">
                              <h2 className="text-md font-medium">
                                {(() => title)()}
                              </h2>
                              <div className="text-sm grid grid-cols-1 w-full">
                                <span className="italic">
                                  Romaji: {anime?.title.romaji}
                                </span>
                                <span className="italic">
                                  Native: {anime?.title.native}
                                </span>
                                <span className="italic">
                                  Next episode in{" "}
                                  <span ref={nextEpisodeRef}>00:00:00:00</span>
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

                                <div className="relative w-full group">
                                  <span className="italic text-wrap w-full lg:text-ellipsis lg:line-clamp-2">
                                    Tags:{" "}
                                    {anime?.tags?.map((tag, idx) =>
                                      idx + 1 === anime.tags?.length
                                        ? tag.name
                                        : tag.name + ", ",
                                    )}
                                  </span>
                                  <div className="absolute hidden lg:group-hover:block lg:group-hover:z-999 bg-neutral-950 bottom-full px-4 py-2 rounded-lg w-4/5 fade-in max-h-25 overflow-auto right-0 lg:hidden">
                                    <span className="size-full">
                                      {anime?.tags?.map((tag, idx) =>
                                        idx + 1 === anime.tags?.length
                                          ? tag.name
                                          : tag.name + ", ",
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="w-full h-3/6 md:h-full md:w-1/2 overflow-hidden">
                              <span className="font-medium">Synopsis</span>
                              <div className="h-8/10 overflow-auto block pe-2 rm-scrollbar">
                                <p
                                  className="size-full text-sm text-justify"
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
                </div>
              </>
            )}

            {isLoading && (
              <div className="size-full p-1 h-[75vh] md:h-[65vh] bg-neutral-900 flex flex-col items-end">
                <Link className="absolute z-1 size-10 left-1" to={"/anime"}>
                  <MoveLeft color="#1447e6" className="size-full" />
                </Link>
                <div className="w-full! h-fit! aspect-14/3! bg-no-repeat bg-cover rounded-lg skeleton-text overflow-visible! relative">
                  <div className="aspect-2/3 z-1 rounded-lg absolute top-[120%] md:top-1/2 left-2 h-57.5">
                    <div className="size-full rounded-lg skeleton"></div>
                    <div className="absolute -bottom-1 rounded-lg w-full h-8 skeleton"></div>
                  </div>
                </div>

                <div className="size-full relative bg-neutral-900">
                  <div className="h-full absolute left-0 z-1 lg:left-47.5 right-0 grid grid-cols-6 grid-rows-7 ">
                    <div className="col-span-3 absolute bottom-0 row-span-1 col-start-1 col-end-4 row-start-7 md:col-start-3 lg:col-start-2 md:relative md:col-span-6 md:row-start-1 flex gap-x-0.5 items-center px-1 flex-wrap h-fit">
                      <span className="skeleton-text h-5 w-12 rounded-full shrink-0"></span>
                      <span className="skeleton-text h-5 w-12 rounded-full shrink-0"></span>
                      <span className="skeleton-text h-5 w-12 rounded-full shrink-0"></span>
                      <span className="skeleton-text h-5 w-12 rounded-full shrink-0"></span>
                      <span className="skeleton-text h-5 w-12 rounded-full shrink-0"></span>
                    </div>
                    <div className="col-span-6 col-start-4 md:col-start-3 lg:col-start-2 row-span-6 row-start-1 md:row-start-2 flex flex-col md:flex-row">
                      <div className="w-full md:w-1/2 h-1/2 md:h-full flex gap-y-0.5 flex-col p-1">
                        <span className="skeleton-text rounded-full w-25 h-5"></span>
                        <div className="w-full h-fit flex flex-col skeleton grow rounded-lg p-1">
                          <span className="skeleton-text rounded-full h-5 w-30"></span>
                          <span className="skeleton-text rounded-full h-5 w-full"></span>
                          <span className="skeleton-text rounded-full h-5 w-9/10"></span>
                          <span className="skeleton-text rounded-full h-5 w-1/2"></span>
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 h-1/2 md:h-full flex gap-y-0.5 flex-col p-1">
                        <span className="skeleton-text rounded-full w-25 h-5"></span>
                        <div className="w-full flex flex-col skeleton grow rounded-lg p-1">
                          <span className="skeleton-text rounded-full h-5 w-1/2"></span>
                          <span className="skeleton-text rounded-full h-5 w-9/10"></span>
                          <span className="skeleton-text rounded-full h-5 w-10/10"></span>
                          <span className="skeleton-text rounded-full h-5 w-1/3"></span>
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

      <section className="my-5 p-2 h-full w-full">
        {title && <AnimeExtensionsResults title={title} idMal={idMal} />}
      </section>
    </>
  );
};

export default AnimeDetail;
