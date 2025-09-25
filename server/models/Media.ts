import mongoose from "mongoose";
import { AnimeSchema, MangaSchema } from "./types/Media";
const { Schema } = mongoose;

const animeSchema = new Schema<AnimeSchema>(
  {
    title: {
      romaji: { type: String, default: null },
      english: { type: String, default: null },
      native: { type: String, default: null },
    },
    thumbnail: {
      type: String,
      default:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg",
    },
    banner: { type: String, default: null },
    nextAiringEpisode: { type: Number, default: 0 },
    updatedAt: { type: Number, default: null },
    format: { type: String, default: null },
    status: { type: String, default: null },
    synopsis: { type: String, default: null },
    duration: { type: Number, default: null },
    anlId: { type: Number, required: true, unique: true },
    idMal: { type: Number, unique: true, default: null },
    bookmarked: { type: Boolean, default: false },
    favorite: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    genres: { type: [String], default: [] },
    episodes: {
      completeEpisodeNumber: { type: Number, default: null },
      lastEpisodeWatched: { type: Number, default: null },
      availableEpisodes: {
        type: [
          {
            episode: { type: Number, required: true },
            playBackPosition: { type: Number, default: 0 },
            episodeTitle: { type: String, default: null },
            sources: {
              type: [
                {
                  name: { type: String, required: true },
                  type: {
                    type: String,
                    enum: ["player", "m3u8"],
                    required: true,
                  },
                  vttEmbedded: { type: Boolean, default: false },
                  url: {
                    sub: { type: String, default: null },
                    dub: { type: String, default: null },
                  },
                  subtitles: {
                    type: [
                      {
                        lang: { type: String, required: true },
                        vtt: { type: String, required: true },
                      },
                    ],
                    default: [],
                  },
                },
              ],
              default: [],
            },
          },
        ],
        default: [],
      },
    },
  },
  { collection: "media" }
);

const mangaSchema = new Schema({}, { collection: "media" });

const Anime = mongoose.model<AnimeSchema>("Anime", animeSchema);
const Manga = mongoose.model<MangaSchema>("Manga", mangaSchema);
export { Anime, Manga, type AnimeSchema, MangaSchema };
