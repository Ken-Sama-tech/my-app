import type { FC } from "react";
import type { MediaCardProps } from "./types/cards";
import ErrorCard from "./ErrorCard";

const MediaCard: FC<MediaCardProps> = ({
  height = 260,
  width = 180,
  src = "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg",
  isLoading = true,
  title = "this is a fucking title",
  snapPosition = "snap-center",
  snap = false,
  isError = false,
  status = "unknown",
  genres = [],
  format = "unknown",
  score = 0,
  effects = true,
}) => {
  return (
    <>
      {!isError && (
        <>
          {!isLoading && (
            <div
              style={{ height: `${height}px`, width: `${width}px` }}
              className={`rounded-lg shrink-0 grow-0 overflow-hidden group ${
                snap ? snapPosition : ""
              }`}
            >
              <div className="relative z-0 flex size-full">
                <div
                  className={`w-[0px] h-full ${
                    effects
                      ? "group-hover:w-full bg-[rgba(0,0,0,0.5)]"
                      : "hidden"
                  } duration-200 transition-[width] ease-in -z-0 absolute p-1 group-hover:z-1 flex flex-col justify-start gap-1 overflow-hidden`}
                >
                  <div className="w-full gap-0.5 flex">
                    <div className="group-hover:opacity-100 duration-200 opacity-0 text-sm rounded-lg -z-0 transition-all hidden group-hover:block !bg-green-500 flex-wrap px-2">
                      {status}
                    </div>
                    <div className="group-hover:opacity-100 duration-200 opacity-0 text-sm px-2 rounded-lg -z-0 transition-all hidden group-hover:block bg-blue-500">
                      {format}
                    </div>
                    <div className="group-hover:opacity-100 duration-200 opacity-0 text-sm px-2 rounded-lg -z-0 transition-all hidden group-hover:block bg-yellow-500">
                      {score ? (score * 0.1).toFixed(1) : score}
                    </div>
                  </div>
                  <div className="text-sm px-2 flex grow justify-center flex-col gap-0.5 w-full font-semibold">
                    <span className="w-full">Genres: </span>

                    <div className="flex flex-wrap gap-1">
                      {genres.map((genre, i) => {
                        return (
                          <span
                            key={i}
                            className="px-2 bg-blue-600 rounded-full"
                          >
                            {genre}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div
                  className={`size-full bg-no-repeat rounded-lg bg-cover ${
                    effects ? "dim" : ""
                  }`}
                  style={{ backgroundImage: `url(${src})` }}
                ></div>
                <div className="absolute w-full h-auto bottom-0 flex overflow-hidden p-0.5">
                  <span className="w-full text-center tex font-medium text-lg">
                    {effects && title}
                  </span>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div
              style={{ height: `${height}px`, width: `${width}px` }}
              className={`realative flex shrink-0 grow-0 flex-col items-center justify-end skeleton rounded-lg aspect-2/3 ${
                snap ? snapPosition : ""
              }`}
            >
              <span className="w-10/11 skeleton skeleton-text !py-2"></span>
              <span className="w-8/10 skeleton skeleton-text !py-2"></span>
            </div>
          )}
        </>
      )}
      {isError && (
        <>
          <div
            style={{ height: `${height}px`, width: `${width}px` }}
            className={`flex items-center justify-center bg-neutral-800 aspect-2/3 shrink-0 rounded-md] `}
          >
            <ErrorCard message="400" title="Http Error" />
          </div>
        </>
      )}
    </>
  );
};

export default MediaCard;
