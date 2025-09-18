import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export type SliderCarouselProps = Props & {
  heading: string;
  url?: string;
};
