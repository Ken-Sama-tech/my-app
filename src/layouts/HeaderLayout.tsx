import type { HeaderLayoutProps } from "./types/layouts";
import Heading from "../components/headings/Heading";
import { FC } from "react";
import { Search } from "lucide-react";
import FilterButton from "../components/buttons/FilterButton";
import KebabButton from "../components/buttons/KebabButton";

const Default = () => {
  return (
    <p className="size-full justify-center flex items-center text-white">
      No option set
    </p>
  );
};

const HeaderLayout: FC<HeaderLayoutProps> = ({
  children,
  className = "",
  filterOption = false,
  kebabOption = false,
  FilterOptionElement = Default,
  KebabOptionElement = Default,
}) => {
  return (
    <header
      className={`w-full p-1 bg-neutral-700 flex flex-nowrap gap-1 shadow-2xs ${className}`}
    >
      <Heading className="text-xl" loading={false}>
        {children}
      </Heading>
      <div className="w-full flex justify-end gap-2 items-center px-2 z-98">
        <div className="w-30 rounded-full outline-2 outline-blue-700 h-7/10 gap-1 flex justify-start items-center overflow-hidden md:w-40">
          <label htmlFor="search" className="cursor-pointer grow shrink-0 ps-1">
            <Search strokeWidth={3} className="size-4" />
          </label>
          <input
            autoComplete="off"
            id="search"
            type="text"
            className="border-none size-9/10 rounded-full ps-1 text-sm outline-none pe-5"
          />
        </div>
        {filterOption && (
          <FilterButton className="!py-0" Element={FilterOptionElement}>
            Filter
          </FilterButton>
        )}
        {kebabOption && <KebabButton Element={KebabOptionElement} />}
      </div>
    </header>
  );
};

export default HeaderLayout;
