import React from "react";
import type { HeadingProps } from "./types/headings";

const Heading: React.FC<HeadingProps> = ({
  children,
  className = "",
  loading = true,
  loadStyle = "",
}) => {
  return (
    <>
      {!loading && (
        <h1 className={`text-3xl font-bold ${className}`}>{children}</h1>
      )}

      {loading && (
        <span className={`rounded-full px-20 skeleton ${loadStyle}`}></span>
      )}
    </>
  );
};

export default Heading;
