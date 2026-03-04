import { useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import anilist, {
  type GenreCollection,
  type MediaFormat,
  type MediaSort,
  type MediaType,
  type MediaSeason,
} from "../../lib/api/anilist/anilist";
import filterQueryBuilder, {
  type GQLVariables,
} from "./utils/filterQueryBuilder";
import MediaCard from "../../components/cards/MediaCard";
import slugify from "../../lib/utils/slugify";

type Genre = GenreCollection[number];

type GQLResponse = {
  Page: {
    media: Array<{
      id: number;
      status: string;
      format: MediaFormat;
      meanScore: number;
      genres: Genre[];
      title: {
        english: string;
        romaji: string;
        native: string;
      };
      coverImage: {
        medium?: string;
        large?: string;
        extraLarge?: string;
      };
    }>;
  };
};

const anl = anilist();

const AnimeFilter: FC = () => {
  const [searchParams] = useSearchParams();
  const [page] = useState<number>(1);
  const [perPage] = useState<number>(20);

  const query = searchParams.get("query") as string;
  const genres = searchParams.getAll("genre") as Genre[];
  const sort = searchParams.getAll("sort") as MediaSort[];
  const type = (searchParams.get("type") || "ANIME") as MediaType;
  const format = searchParams.getAll("format") as MediaFormat[];
  const season = searchParams.get("season") as MediaSeason;
  const seasonYear = Number(searchParams.get("seasonYear")) as number;
  const isAdult = (
    searchParams.get("isAdult") === "true" ? true : false
  ) as boolean;

  const gql = filterQueryBuilder({
    query,
    genres,
    sort,
    type,
    format,
    season,
    seasonYear,
    isAdult,
    page,
    perPage,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["filter", window.location.search],
    queryFn: () =>
      anl.query<GQLResponse, GQLVariables>(gql, {
        ...(query && { query }),
        ...(genres && { genres }),
        ...(sort && { sort }),
        ...(type && { type }),
        ...(format && { format }),
        ...(season && { season }),
        ...(seasonYear && { seasonYear }),
        ...(isAdult && { isAdult }),
        page,
        perPage,
      }),
  });

  return (
    <section className="p-2 size-full">
      {!isLoading && !data?.error && (
        <div className="flex gap-2 flex-wrap justify-center size-fit">
          {data?.data.Page.media.map((m) => {
            const title = m.title.romaji || m.title.native || m.title.english;

            return (
              <Link
                key={m.id}
                to={`/anime/${m.id}/${slugify(title)}`}
                className="col-span-1"
              >
                <MediaCard
                  isError={false}
                  isLoading={false}
                  score={m.meanScore}
                  format={m.format}
                  status={m.status}
                  genres={m.genres}
                  effects={true}
                  src={m.coverImage.extraLarge}
                  title={m.title.romaji || m.title.native}
                />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AnimeFilter;
