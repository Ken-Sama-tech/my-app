import MediaCard from "../../components/cards/MediaCard";
import anilist from "../../lib/api/anilist/anilist";
import { useQuery } from "@tanstack/react-query";
import SliderCarousel from "../../components/carousels/SliderCarousel";
import slugify from "../../lib/utils/slugify";
import { Link } from "react-router-dom";
import type { FC } from "react";
import type { AnilistPageQueryResponse } from "../../pages/Anime/types/anime";

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

const queryPage = anilist().Page<AnilistPageQueryResponse>({ perPage: 20 });
const getTrending = queryPage.media({ sort: ["TRENDING_DESC"] }, queryData);
const getPopular = queryPage.media({ sort: ["POPULARITY_DESC"] }, queryData);
const getTopAnime = queryPage.media({ sort: ["SCORE_DESC"] }, queryData);

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
          {isTrendingAnimeLoading &&
            Array.from({ length: 20 }, (_, idx) => {
              return <MediaCard snap key={idx} />;
            })}
          {!isTrendingAnimeLoading &&
            trendingAnime?.data?.Page.media.map((item) => {
              const { romaji, english, native } = item.title;

              return (
                <Link
                  to={`/anime/${item.id}/${slugify(
                    String(romaji || native || english)
                  )}`}
                  key={item.id}
                >
                  <MediaCard
                    genres={item.genres}
                    score={item.meanScore}
                    format={item.format}
                    status={item.status}
                    snap
                    isError={trendingAnimeHasError}
                    isLoading={false}
                    src={item.coverImage?.extraLarge}
                    title={english || romaji || native}
                  />
                </Link>
              );
            })}
        </SliderCarousel>
        <SliderCarousel heading="Popular Anime" url="/anime/popular">
          {isPopularAnimeLoading &&
            Array.from({ length: 20 }, (_, idx) => {
              return <MediaCard snap key={idx} />;
            })}
          {!isPopularAnimeLoading &&
            popularAnime?.data?.Page.media.map((item) => {
              const { romaji, english, native } = item.title;
              return (
                <Link
                  to={`/anime/${item.id}/${slugify(
                    String(romaji || native || english)
                  )}`}
                  key={item.id}
                >
                  <MediaCard
                    genres={item.genres}
                    score={item.meanScore}
                    format={item.format}
                    status={item.status}
                    snap
                    isError={popularAnimeHasError}
                    isLoading={false}
                    src={item.coverImage?.extraLarge}
                    title={english || romaji || native}
                  />
                </Link>
              );
            })}
        </SliderCarousel>
        <SliderCarousel heading="Top Anime" url="/anime/top">
          {isTopAnimeLoading &&
            Array.from({ length: 20 }, (_, idx) => {
              return <MediaCard snap key={idx} />;
            })}
          {!isTopAnimeLoading &&
            topAnime?.data?.Page.media.map((item) => {
              const { romaji, english, native } = item.title;
              return (
                <Link
                  key={item.id}
                  to={`/anime/${item.id}/${slugify(
                    String(romaji || native || english)
                  )}`}
                >
                  <MediaCard
                    genres={item.genres}
                    score={item.meanScore}
                    format={item.format}
                    status={item.status}
                    snap
                    isError={topAnimeHasError}
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
