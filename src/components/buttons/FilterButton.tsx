import type { FC } from "react";
import type { FilterButtonProps } from "./types/buttons";
import { ListFilter } from "lucide-react";
import { useState } from "react";

const FilterButton: FC<FilterButtonProps> = ({
  children = "List",
  Element,
  className = "",
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsActive((prev) => (prev ? false : true))}
        type="button"
        className={`
        cursor-pointer
        flex items-center gap-2
        rounded-full
        bg-blue-700 text-white font-medium
        px-2 py-1 shadow-2xl
        hover:bg-blue-800
        ${className}
      `}
      >
        <ListFilter className="size-5" strokeWidth={3} />
        <span>{children}</span>
      </button>

      <div
        className={`shadow-md shadow-neutral-800 w-[250px] h-100 top-10 right-0 bg-neutral-800 absolute rounded-lg ${
          isActive ? "" : "hidden"
        }`}
      >
        {<Element />}
      </div>
    </div>
  );
};

export default FilterButton;
