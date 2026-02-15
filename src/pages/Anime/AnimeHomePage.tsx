import MediaCard from "../../components/cards/MediaCard";
import anilist from "../../lib/api/anilist/anilist";
import { useQuery } from "@tanstack/react-query";
import SliderCarousel from "../../components/carousels/SliderCarousel";
import slugify from "../../lib/utils/slugify";
import { Link } from "react-router-dom";
import type { FC } from "react";
import type { AnilistPageQueryResponse } from "./types/anime";

const queryData: string[] = [
  "id",
  "idMal",
  "title {english native romaji}",
  "coverImage { extraLarge }",
  "meanScore",
  "status",
  "genres",
  "format",
];

const queryPage = anilist().page<AnilistPageQueryResponse>({ perPage: 20 });
const getTrending = queryPage.media(
  { /*isAdult: true,*/ sort: ["TRENDING_DESC"] },
  queryData,
);
const getPopular = queryPage.media(
  { /*isAdult: true,*/ sort: ["POPULARITY_DESC"] },
  queryData,
);
const getTopAnime = queryPage.media(
  { /*isAdult: true,*/ sort: ["SCORE_DESC"] },
  queryData,
);

const AnimeHomePage: FC = () => {
  const {
    data: trendingAnime,
    isLoading: isTrendingAnimeLoading,
    isError: trendingAnimeHasError,
  } = useQuery({
    queryFn: () => getTrending.query(),
    queryKey: ["trending-anime"],
  });
  const {
    data: popularAnime,
    isLoading: isPopularAnimeLoading,
    isError: popularAnimeHasError,
  } = useQuery({
    queryFn: () => getPopular.query(),
    queryKey: ["popular-anime"],
  });
  const {
    data: topAnime,
    isLoading: isTopAnimeLoading,
    isError: topAnimeHasError,
  } = useQuery({
    queryFn: () => getTopAnime.query(),
    queryKey: ["top-anime"],
  });

  return (
    <>
      <div className="flex overflow-auto flex-wrap gap-10 rm-scrollbar p-5">
        <SliderCarousel heading="Trending Anime" url="/anime/trending">
          {(isTrendingAnimeLoading || trendingAnimeHasError) &&
            Array.from({ length: 20 }, (_, idx) => {
              return (
                <MediaCard snap key={idx} isError={trendingAnimeHasError} />
              );
            })}
          {!isTrendingAnimeLoading &&
            !trendingAnimeHasError &&
            trendingAnime?.data?.Page.media.map((item) => {
              const { romaji, english, native } = item.title;

              return (
                <Link
                  to={`/anime/${item.id}/${slugify(
                    String(romaji || native || english),
                  )}`}
                  key={item.id}
                >
                  <MediaCard
                    genres={item.genres}
                    score={item.meanScore}
                    format={item.format}
                    status={item.status}
                    snap
                    isLoading={false}
                    src={item.coverImage?.extraLarge}
                    title={english || romaji || native}
                  />
                </Link>
              );
            })}
        </SliderCarousel>
        <SliderCarousel heading="Popular Anime" url="/anime/popular">
          {(isPopularAnimeLoading || popularAnimeHasError) &&
            Array.from({ length: 20 }, (_, idx) => {
              return (
                <MediaCard snap key={idx} isError={popularAnimeHasError} />
              );
            })}
          {!isPopularAnimeLoading &&
            !popularAnimeHasError &&
            popularAnime?.data?.Page.media.map((item) => {
              const { romaji, english, native } = item.title;
              return (
                <Link
                  to={`/anime/${item.id}/${slugify(
                    String(romaji || native || english),
                  )}`}
                  key={item.id}
                >
                  <MediaCard
                    genres={item.genres}
                    score={item.meanScore}
                    format={item.format}
                    status={item.status}
                    snap
                    isLoading={false}
                    src={item.coverImage?.extraLarge}
                    title={english || romaji || native}
                  />
                </Link>
              );
            })}
        </SliderCarousel>
        <SliderCarousel heading="Top Anime" url="/anime/top">
          {(isTopAnimeLoading || topAnimeHasError) &&
            Array.from({ length: 20 }, (_, idx) => {
              return <MediaCard snap key={idx} isError={topAnimeHasError} />;
            })}
          {!isTopAnimeLoading &&
            !topAnimeHasError &&
            topAnime?.data?.Page.media.map((item) => {
              const { romaji, english, native } = item.title;
              return (
                <Link
                  key={item.id}
                  to={`/anime/${item.id}/${slugify(
                    String(romaji || native || english),
                  )}`}
                >
                  <MediaCard
                    genres={item.genres}
                    score={item.meanScore}
                    format={item.format}
                    status={item.status}
                    snap
                    isLoading={false}
                    src={item.coverImage?.extraLarge}
                    title={english || romaji || native}
                  />
                </Link>
              );
            })}
        </SliderCarousel>
      </div>
    </>
  );
};

export default AnimeHomePage;
