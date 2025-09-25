import { type ObjectId } from "mongoose";

export type AnimeSchema = {
  _id?: ObjectId | number;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  thumbnail?: string;
  banner?: string;
  nextAiringEpisode?: number;
  updatedAt?: number;
  format?: string;
  status?: string;
  synopsis?: string;
  duration?: number;
  anlId: number;
  idMal?: number;
  bookmarked?: boolean;
  favorite?: boolean;
  tags?: string[];
  genres?: string[];
  episodes?: {
    completeEpisodeNumber?: number;
    lastEpisodeWatched: number;
    availableEpisodes?: {
      episode: number;
      playBackPosition: number;
      episodeTitle?: string;
      sources?: {
        name: string;
        type: "player" | "m3u8";
        vttEmbedded?: boolean;
        url?: {
          sub?: string;
          dub?: string;
        };
        subtitles?: { lang: string; vtt: string }[];
      }[];
    }[];
  };
};

export type MangaSchema = {
  _id?: number | ObjectId;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  thumbnail?: string;
  banner?: string;
  nextAiringEpisode?: number;
  updatedAt?: number;
  format?: string;
  status?: string;
  synopsis?: string;
  duration?: number;
  anlId: number;
  idMal?: number;
  bookmarked?: boolean;
  favorite?: boolean;
  tags?: string[];
  genres?: string[];
  chapters?: {};
};
