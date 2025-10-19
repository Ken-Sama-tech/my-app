import { useState, type FC } from "react";
import useExtensions from "../../../lib/hooks/useExtensions";
import type { AnimeExtensions } from "../../../../server/models/types/Extensions";
import type { SearchAnimeUtilResponse } from "../../../../dist/backend/server/utils/animeExtension/searchAnime";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useServerConfig from "../../../lib/hooks/useServerConfig";
import type { ExtensionsResponse } from "../../../../server/models/types/Extensions";
import SimpleError from "../../../components/ui/SimpleError";
import { useNavigate } from "react-router-dom";

type AnimeExtensionResultProps = {
  id?: number;
  title?: string;
};

type SearchEpisodes = (
  extensions?: ExtensionsResponse[],
  url?: string,
  title?: string,
  idMal?: number
) => Promise<SearchAnimeUtilResponse[] | undefined | null>;

const searchEpisodes: SearchEpisodes = async (
  extensions,
  url,
  title,
  idMal
) => {
  try {
    if (!title) return;
    const activeExtensions: AnimeExtensions[] =
      extensions?.filter((ext) => ext.active).map((ext) => ext.name) || [];

    const { data } = await axios.get<
      SearchAnimeUtilResponse[] | SearchAnimeUtilResponse
    >(
      `${url}/extensions/anime/search?${
        activeExtensions.length
          ? activeExtensions
              .map((ext) => `ext=${ext}`)
              .join(",")
              .replace(/,/g, "&")
          : ""
      }&title=${title}${idMal ? `&idMal=${idMal}` : ""}`
    );

    if (!Array.isArray(data)) return null;

    return data;
  } catch (error: any) {
    console.error("Error", error.message || error);
    return;
  }
};

const AnimeExtensionResult: FC<AnimeExtensionResultProps> = ({ title, id }) => {
  const navigate = useNavigate();
  const config = useServerConfig();
  const { data: extensions } = useExtensions("anime").getExtensions();
  const {
    data: search,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["anime-episodes", id],
    queryFn: () =>
      searchEpisodes(extensions, config.getServerUrl, title, id) || null,
  });

  const [logoCollection] = useState<Map<AnimeExtensions, string>>(
    new Map(extensions?.map((ext) => [ext.name, ext.logo]))
  );

  console.log(logoCollection);

  return (
    <section className="bg-neutral-900 w-full h-fit px-2 relative py-5">
      {!isLoading && (
        <div className="w-full min-h-[240px] h-full bg-neutral-800 rounded-2xl">
          {!isError && (
            <div className="size-full flex relative p-3 gap-2 flex-wrap justify-center min-h-[240px] h-full md:justify-start">
              {!search && (
                <div className="absolute-center">
                  <span className="font-semibold text-2xl">
                    No result found
                  </span>
                </div>
              )}
              {search?.map((res) => {
                return (
                  <div
                    key={`${res.data?.title}`}
                    className="min-h-[70px] h-full w-full md:w-[250px] bg-neutral-700 shrink-0 rounded-lg grow-0 flex px-1 py-1.5 gap-0.5 items-start flex-wrap"
                  >
                    <div className="flex items-center w-full gap-0.5">
                      <div
                        className="aspect-1/1 rounded-md h-[30px] bg-no-repeat bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${logoCollection.get(
                            res.extension
                          )})`,
                        }}
                      ></div>
                      <span className="grow shrink-0 text-ellipsis line-clamp-1 uppercase">
                        {res.extension}
                      </span>
                    </div>
                    <div className="bg-neutral-500 w-full h-0.5 my-1 rounded-full"></div>
                    <div className="w-full grow justify-center items-center shrink-0 flex gap-1">
                      {res.error && (
                        <span className="font-medium">{res.message}</span>
                      )}

                      {!res.error && (
                        <>
                          <div className="w-1/2">
                            <button
                              className="py-0 5 px-1 w-full bg-blue-700 rounded cursor-pointer"
                              onClick={() =>
                                navigate(
                                  `watch?translationType=dub&extension=${
                                    res.extension
                                  }${id ? `&idMal=${id}` : ""}`
                                )
                              }
                            >
                              Dub: {res.data?.episodes.dub || 0}
                            </button>
                          </div>
                          <div className="w-1/2">
                            <button
                              className="py-0 5 px-1 bg-blue-700 w-full rounded cursor-pointer"
                              onClick={() =>
                                navigate(
                                  `watch?translationType=sub&extension=${
                                    res.extension
                                  }${id ? `&idMal=${id}` : ""}`
                                )
                              }
                            >
                              Sub: {res.data?.episodes.sub || 0}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isError && (
            <div className="w-6/10 md:w-1/2 lg:w-1/3 absolute-center">
              <SimpleError message="Extensions failed to load. Please try again later" />
            </div>
          )}
        </div>
      )}
      {isLoading && (
        <div className="w-full h-[240px] rounded-2xl z-1 skeleton bg-neutral-800"></div>
      )}
    </section>
  );
};

export default AnimeExtensionResult;
