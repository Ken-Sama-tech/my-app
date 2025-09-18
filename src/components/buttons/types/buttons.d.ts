import type { ReactNode, FC } from "react";

type CommonProps = {
  children?: ReactNode;
  className?: string;
};

export type FilterButtonProps = CommonProps & {
  Element: FC;
};

export type KebabButtonProps = CommonProps & {
  Element: FC;
};
