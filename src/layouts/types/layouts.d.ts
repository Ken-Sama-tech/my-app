import { FC, ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export type LayoutProps = Props & {};

export type HeaderLayoutProps = Props & {
  kebabOption?: boolean;
  filterOption?: boolean;
  element?: ReactNode;
};
