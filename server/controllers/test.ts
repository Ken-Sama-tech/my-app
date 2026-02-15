import { Anime, type AnimeSchema } from "../models/Media.js";
import conn from "../config/config.js";

const testController = async () => {
  await conn();
  const document: AnimeSchema = {
    title: {
      romaji: "some title in romaji",
      english: "some title in english",
      native: "some title in native",
    },
    episodes: {
      completeEpisodeNumber: 10,
      lastEpisodeWatched: 1,

      availableEpisodes: [
        {
          episode: 1,
          bookmarked: true,
          playBackPosition: 0,
          episodeTitle: "",
          sources: [
            {
              name: "allanime",
              type: "player",
              url: {
                sub: "https://embeddedvideo.mp4",
                dub: "https://embeddedvideo-eng-dub.mp4",
              },
              subtitles: [
                {
                  lang: "eng",
                  vtt: "https://embeddedvideo-vtt.vtt",
                },
              ],
            },
          ],
        },
      ],
    },
    status: "Realeasing",
    updatedAt: 18212001,
    anlId: 1821,
    idMal: 128229,
  };

  const response = await Anime.create<AnimeSchema>(document);

  await response.save();
  console.log("saved");
};

export default testController;
