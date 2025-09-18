import React from "react";
import type { HeadingProps } from "./types/headings";

const SubHeading: React.FC<HeadingProps> = ({
  children,
  className = "",
  loading = true,
  loadStyle = "",
}) => {
  return (
    <>
      {!loading && (
        <h2 className={`text-2xl font-semibold ${className}`}>{children}</h2>
      )}

      {loading && (
        <span className={`rounded-full px-20 skeleton ${loadStyle}`}></span>
      )}
    </>
  );
};

export default SubHeading;
