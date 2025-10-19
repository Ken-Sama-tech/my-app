import { useState } from "react";
import type { FC } from "react";
import type { KebabButtonProps } from "./types/buttons";
import { EllipsisVertical } from "lucide-react";

const KebabButton: FC<KebabButtonProps> = ({ className = "", element }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  return (
    <div className={`relative h-8/10 w-6 z-9 flex justify-center ${className}`}>
      <button
        onClick={() => setIsActive((prev) => (prev ? false : true))}
        className={`cursor-pointer`}
      >
        <EllipsisVertical className="size-full" />
      </button>
      <div
        className={`shadow-md shadow-neutral-700 z-1 w-[200px] h-80 top-10 right-0 bg-neutral-800 absolute rounded-lg ${
          isActive ? "" : "hidden"
        }`}
      >
        {element}
      </div>
    </div>
  );
};

export default KebabButton;
