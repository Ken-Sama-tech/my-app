export type MediaCardProps = {
  src?: string;
  isLoading?: boolean;
  height?: number;
  width?: number;
  title?: string;
  isError?: boolean;
  snap?: boolean;
  snapPosition?: "snap-center" | "snap-start" | "snap-end";
  score?: number;
  status?: string;
  genres?: string[];
  format?: string;
  effects?: boolean;
};

export type ErrorCardProps = {
  title?: string;
  message: string;
};
