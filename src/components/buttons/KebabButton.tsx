import { FC, useState } from "react";
import { KebabButtonProps } from "./types/buttons";
import { EllipsisVertical } from "lucide-react";

const KebabButton: FC<KebabButtonProps> = ({
  children,
  className = "",
  Element,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  return (
    <div className="relative h-9/10">
      <button
        onClick={() => setIsActive((prev) => (prev ? false : true))}
        className={`cursor-pointer`}
      >
        <EllipsisVertical />
      </button>
      <div
        className={`shadow-md shadow-neutral-700 w-[200px] h-80 top-10 right-0 bg-neutral-800 absolute rounded-lg ${
          isActive ? "" : "hidden"
        }`}
      >
        {<Element />}
      </div>
    </div>
  );
};

export default KebabButton;
