import { type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useParams } from "react-router-dom";
import useServerConfig from "../../lib/hooks/useServerConfig";
import axios from "axios";
import type { LoadEpisodeResponse } from "../../../extensions/anime/allanime/index";

type Response = {
  episodes: Array<LoadEpisodeResponse & { error: boolean; message: string }>;
  referrer: string;
};

const AnimeWatch: FC = () => {
  const config = useServerConfig();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const idMal: string | null = searchParams.get("idMal");
  const title: string = params.slug?.replace(/-/g, " ") || "";
  const translationType: string = searchParams.get("translationType") || "sub";
  const extension: string = searchParams.get("extensions") || "allanime";
  const episode: string | number = searchParams.get("episode") || 1;
  const base = config.getServerUrl;

  const { data: response, isLoading } = useQuery({
    queryKey: [idMal, episode],
    queryFn: () =>
      axios
        .get<Response>(
          `${base}/extensions/anime/episodes?ext=${extension}&translationType=${translationType}&title=${title}${
            idMal ? `&idMal=${idMal}` : ""
          }&episode=${episode}`
        )
        .then((res) => res.data),
  });

  console.log(response);

  return (
    <section className="bg-neutral-950 w-full h-fit min-h-dvh flex items-start justify-center flex-wrap lg:p-5 gap-1">
      <div className="w-full aspect-16/9 bg-neutral-900 flex lg:w-8/10 grow-0 shrink-0 rounded-md">
        {!isLoading && (
          <video controls muted autoPlay className="size-full">
            <source
              src={`${base}/proxy/player?referrer=${response?.referrer}&url=${
                response?.episodes.find(
                  (ep) => ep.currentEpisode === Number(episode)
                )?.url || 1
              }`}
              type="video/mp4"
            />
          </video>
        )}

        {isLoading && <div> ...loading</div>}
      </div>
      <div className="bg-neutral-800 grow shrink-0 rounded-md h-dvh w-full lg:w-auto"></div>
    </section>
  );
};

export default AnimeWatch;
