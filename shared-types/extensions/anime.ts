type DubTranslation = "Eng" | "Chi" | "Jap";

type SubTranslation = "Eng";

export type AnimeExtensions = "allanime" | "bato.to" | "hentai haven";

export type Translation = "sub" | "dub";

export type Languages = "Eng" | "Chi" | "Jap";

export type Source = {
  name: string;
  url: string;
};

export type EpisodeList = {
  episodeTitle: string;
  episode: number;
};

export type MalId = number;

export type Id = number | string;

export type Dub = {
  lang: DubTranslation;
  episodes: number;
};

export type Sub = {
  lang: SubTranslation;
  episodes: number;
};

// export type Episodes = {
//   subs: Sub[];
//   dubs: Dub[];
// };
