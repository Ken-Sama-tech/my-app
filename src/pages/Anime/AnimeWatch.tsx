import { type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import useServerConfig from "../../lib/hooks/useServerConfig";
import axios from "axios";
import type { LoadEpisodeResponse } from "../../../extensions/anime/allanime/index";
import SimpleError from "../../components/ui/SimpleError";

type AnimeEpisodes = {
  episodes: Array<LoadEpisodeResponse & { error: boolean; message: string }>;
  referrer: string;
};

const AnimeWatch: FC = () => {
  const config = useServerConfig();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idMal: string | null = searchParams.get("idMal");
  const title: string = params.slug?.replace(/-/g, " ") || "";
  const translationType: string = searchParams.get("translationType") || "sub";
  const extension: string = searchParams.get("extensions") || "allanime";
  const currentEpisode: string | number = searchParams.get("episode") || 1;
  const base = config.getServerUrl;

  const { data: anime, isLoading } = useQuery({
    queryKey: [idMal, currentEpisode],
    queryFn: () =>
      axios
        .get<AnimeEpisodes>(
          `${base}/extensions/anime/episodes?ext=${extension}&translationType=${translationType}&title=${title}${
            idMal ? `&idMal=${idMal}` : ""
          }&episode=${currentEpisode}`
        )
        .then((res) => res.data),
  });

  const { data: availableEpisodes } = useQuery({
    queryKey: [""],
    queryFn: () => null,
  });

  return (
    <section
      className="bg-neutral-950 w-full flex items-start justify-center flex-wrap lg:p-5 gap-1"
      id="player-section"
    >
      <div className="w-full aspect-video relative bg-neutral-900 flex lg:w-8/10 grow-0 shrink-0 rounded-md">
        {!isLoading && anime && (
          <>
            {(() => {
              const result = anime?.episodes?.find(
                (ep) => ep.episode === Number(currentEpisode)
              );

              if (!result?.url)
                return (
                  <div className="size-1/2 absolute-center flex items-center justify-center">
                    <SimpleError message={result?.message} />
                  </div>
                );

              return (
                <video controls muted autoPlay className="size-full">
                  <source
                    src={`${base}/proxy/player?referrer=${anime?.referrer}&url=${result?.url}`}
                    type="video/mp4"
                  />
                </video>
              );
            })()}
          </>
        )}

        {isLoading && (
          <div className="size-full relative">
            <span className="spinner absolute-center"></span>
          </div>
        )}
      </div>
      <div className="bg-neutral-900 grow shrink-0 flex flex-col overflow-y-auto gap-2  rounded-md h-dvh w-full lg:w-auto">
        {}
      </div>
    </section>
  );
};

export default AnimeWatch;
