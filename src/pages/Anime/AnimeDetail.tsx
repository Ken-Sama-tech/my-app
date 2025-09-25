import { FC, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import anilist from "../../lib/api/anilist/anilist";
import MediaCard from "../../components/cards/MediaCard";
import { AnilistMediaQueryResponse } from "./types/anime";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import formatDate from "../../lib/utils/formatDate";
import SimpleError from "../../components/ui/SimpleError";

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
      isAdult: false,
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
        node.textContent = `Next episode at: ${formatDate(
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
    <section className="flex items-start w-full h-[65vh] bg-neutral-900 shadow-2xl">
      {!isLoading && (
        <div className="relative flex flex-col items-end size-full">
          <div
            style={{ backgroundImage: `url(${anime?.bannerImage})` }}
            className="w-full aspect-14/3 flex relative bg-no-repeat bg-contain overflow-visible bg-neutral-950"
          >
            {!anime?.bannerImage && (
              <div className="absolute size-full flex items-center justify-center">
                <SimpleError message="Banner not available" />
              </div>
            )}
            <Link
              target="_blank"
              to={anime?.coverImage?.extraLarge || "#"}
              className="block absolute top-[120%] sm:top-1/3 md:top-1/2 z-2 left-5"
            >
              <MediaCard
                src={anime?.coverImage?.extraLarge}
                isLoading={false}
                effects={false}
              />
            </Link>
          </div>
          <div className="relative size-full">
            <div className="absolute h-full gap-1 right-0 left-[220px] flex flex-col items-start p-2 ">
              <div className="w-full flex gap-1 py-0.5 flex-wrap">
                <Badge className="!px-3 !py-1 text-sm h-fit">
                  {anime?.status || "unknown"}
                </Badge>
                <Badge className="!px-3 !py-1 text-sm h-fit">
                  {"Episodes: " + (anime?.episodes || "null")}
                </Badge>
                <Badge className="!px-3 !py-1 text-sm h-fit">
                  {anime?.format || "unknown"}
                </Badge>
                <Badge className="!px-3 !py-1 text-sm h-fit">
                  {"Duration: " +
                    (anime?.duration
                      ? anime.duration + " per mins"
                      : "duration: uknown")}
                </Badge>
                <Badge className="!px-3 !py-1 text-sm h-fit">
                  {"Score: " +
                    ((Number(anime?.meanScore) * 0.1).toFixed(1) || 0)}
                </Badge>
              </div>
              <div className="grow overflow-hidden">
                <div className="h-full w-full flex gap-0.5">
                  <div className="w-2/3 h-full p-1 text-md">
                    <h2 className="text-md font-medium">
                      {(() => {
                        const title = anime?.title;
                        return title?.english || title?.romaji || title?.native;
                      })()}
                    </h2>
                    <div className="text-sm grid">
                      <span className="italic">
                        Romaji: {anime?.title.romaji}
                      </span>
                      <span className="italic">
                        Native: {anime?.title.native}
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
                            return <span key={genre + idx}>{genre}</span>;
                          return <span key={genre + idx}>{genre}, </span>;
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="w-1/3 h-full p-1 block overflow-auto rm-scrollbar">
                    <span className="font-md">Synopsis: </span>
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
      )}

      {isLoading && <>...loading</>}
    </section>
  );
};

export default AnimeDetail;
