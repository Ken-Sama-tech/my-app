import type { ReactElement } from "react";

type Keys = "Anime" | "Manga" | "Novel" | "Library" | "History";

export type RoutesResponse = {
  label: Keys;
  path: string;
  children?: {
    label: ChildRoutesKey;
    path: string;
  }[];
};

export type RoutesKey = Keys;

export type ChildRoutesKey = "Anime Detail" | "Watch";

export type RoutesValue = {
  default: ReactElement;
  layout: ReactElement;
  childrenRoutes?: Map<ChildRoutesKey, ReactElement>;
};
