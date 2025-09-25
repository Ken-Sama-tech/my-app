import search from "./search.js";
import Fuse from "fuse.js";
import {
  SearchResponseData,
  TranslationType,
  Anime,
  LoadAnime,
} from "./index.js";
import getSourceURL from "./getSourceURL.js";
import decodeHexString from "./utils/decodeHexString.js";
import { allAnimeHeaders } from "./vars.js";

const anime = async (title: string, idMal: number): Promise<Anime> => {
  const res = await search(title);
  const { data } = res;

  const fuse = new Fuse(data, {
    keys: ["name"],
    threshold: 0.2,
  });

  const anime: SearchResponseData = [];

  if (idMal) {
    const res = data.find((a) => Number(a.malId) === idMal);
    anime.push(res);
  } else {
    const res = fuse.search(title).map((s) => s.item);
    anime.push(res[0]);
  }

  return {
    entry: anime[0],
    hasEntry: anime[0] ? true : false,
  };
};

const loadAnime = async (
  title: string,
  idMal: number = 0
): Promise<LoadAnime> => {
  const { hasEntry, entry } = await anime(title, idMal);

  if (!hasEntry) {
    console.error("Invalid entry");
    return;
  }

  const { malId, name, _id } = entry;
  const { sub, dub } = entry.availableEpisodes;

  return {
    showId: _id,
    malId,
    name,
    sub,
    dub,
    headers: {
      Referer: "https://allmanga.to",
    },
    type: "player",
    loadEpisode: async (
      episode: number = 1,
      translationType: TranslationType = "sub"
    ) => {
      const episodes = translationType === "sub" ? sub : dub;
      const invalidEpisode = (): number => {
        console.error(
          "Entered episode is invalid, therefore episode 1 was loaded instead"
        );
        return 1;
      };
      const validatedEp: number | string =
        Number(episode) <= 0 || Number(episode) > episodes
          ? invalidEpisode()
          : episode;

      const sources = await getSourceURL(
        _id,
        translationType,
        String(validatedEp)
      );

      const source = sources.data.sourceUrls.find(
        (url) => url.type === "player"
      );

      const hexedURL = source.sourceUrl;
      const url = decodeHexString(hexedURL);

      return {
        currentEpisode: episode,
        translationType,
        url,
        html: `<video autoplay muted controls width="540" height="220" className="size-full"><source src="http://localhost:3000/proxy/player?url=${url}&referrer=${allAnimeHeaders.Referer}" type="video/mp4" /></video>`,
      };
    },
  };
};

const allanimeExt = () => {
  return { anime, loadAnime };
};

export default allanimeExt;
