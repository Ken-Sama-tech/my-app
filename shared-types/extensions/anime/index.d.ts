type DubTranslation = "Eng" | "Chi" | "Jap";

type SubTranslation = "Eng";

export type Extensions = "allanime" | "bato.to" | "hentai haven";

export type Translation = "sub" | "dub";

export type Languages = "Eng" | "Chi" | "Jap";

export type Source = {
  name: string;
  url: string;
};

export type MalId = number;

export type Id = number | string;

export type Dub = {
  lang: DubTranslation;
  availableEpisodes: number;
};

export type Sub = {
  lang: SubTranslation;
  availableEpisodes: number;
};

export type Episodes = {
  subs: Sub[];
  dubs: Dub[];
};
