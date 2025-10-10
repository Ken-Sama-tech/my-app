import type { HeaderLayoutProps } from "./types/layouts";
import Heading from "../components/headings/Heading";
import type { FC } from "react";

const HeaderLayout: FC<HeaderLayoutProps> = ({
  children,
  className = "",
  element,
}) => {
  return (
    <header
      className={`w-full p-1 bg-neutral-700 flex flex-nowrap gap-1 shadow-2xs ${className}`}
    >
      <Heading className="text-xl" loading={false}>
        {children}
      </Heading>
      {element}
    </header>
  );
};

export default HeaderLayout;
