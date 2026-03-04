import type {
  MediaSeason,
  MediaSort,
  MediaType,
  MediaFormat,
} from "../../../lib/api/anilist/anilist";

export type GQLVariables = {
  page?: number;
  perPage?: number;
  query?: string;
  genres?: string[];
  sort?: MediaSort[];
  type?: MediaType;
  format?: MediaFormat[];
  isAdult?: boolean;
  season?: MediaSeason;
  seasonYear?: number;
};

const filterQueryBuilder = (vars: GQLVariables): string => {
  const {
    page,
    perPage,
    query,
    genres,
    sort,
    type,
    format,
    season,
    seasonYear,
    isAdult,
  } = vars;

  const variableMap: Record<string, string | undefined> = {
    page: page ? "Int" : undefined,
    perPage: perPage ? "Int" : undefined,
    query: query ? "String" : undefined,
    genres: genres?.length ? "[String]" : undefined,
    sort: sort ? "[MediaSort]" : undefined,
    type: type ? "MediaType" : undefined,
    format: format?.length ? "[MediaFormat]" : undefined,
    season: season ? "MediaSeason" : undefined,
    seasonYear: seasonYear ? "Int" : undefined,
    isAdult: typeof isAdult === "boolean" ? "Boolean" : undefined,
  };

  const variableDefinitions = Object.entries(variableMap)
    .filter(([, value]) => value)
    .map(([key, value]) => `$${key}: ${value}`)
    .join(", ");

  const mediaArgMap: Record<string, string> = {
    query: "search",
    genres: "genre_in",
    format: "format_in",
  };

  const invalidMediaArgs = new Set(["page", "perPage"]);

  const mediaArguments = Object.keys(variableMap)
    .filter((key) => variableMap[key] && !invalidMediaArgs.has(key))
    .map((key) => {
      const gqlKey = mediaArgMap[key] ?? key;
      return `${gqlKey}: $${key}`;
    })
    .join(", ");

  return `
    query ${variableDefinitions ? `(${variableDefinitions})` : ""} {
      Page(perPage: $perPage, page: $page) {
        media(${mediaArguments}) {
          id
          idMal
          title {
            english
            romaji
            native
          }
          coverImage {
            medium
            large
            extraLarge
          }
          genres
          meanScore
          status
          format
        }
      }
    }
  `;
};

export default filterQueryBuilder;
