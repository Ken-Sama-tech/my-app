import type { UIProps } from "./types/ui";
import type { FC } from "react";

const Badge: FC<UIProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-blue-700 w-fit px-2 py-1 shadow-sm shadow-blue-800 text-neutral-600 rounded-full font-medium ${className}`}
    >
      {children}
    </div>
  );
};

export default Badge;
