import type { FC } from "react";
import { HeartPlus, Heart } from "lucide-react";
import generateUniqueId from "../../lib/utils/generateUniqueId";
import { useState } from "react";

type AddToLibraryToggleProps = {
  className?: string;
  checked?: boolean;
  callback?: (isChecked: boolean) => void;
};

const AddToLibraryToggle: FC<AddToLibraryToggleProps> = ({
  className = "",
  checked = false,
  callback,
}) => {
  const [uniqueId] = useState<string>(generateUniqueId());
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <label
      title="add to library"
      htmlFor={uniqueId}
      className={`size-full shrink-0 flex justify-center p-0.5 items-center relative cursor-pointer rounded-full ${className}`}
    >
      <input
        defaultChecked={checked}
        ref={(node: HTMLInputElement) => {
          if (!node) return;
          node.addEventListener("change", () => {
            setIsChecked(node.checked);
            if (callback) callback(node.checked);
          });
        }}
        type="checkbox"
        className="size-full invisible relative after:content-[''] checked:after:bg-red-400 after:visible after:absolute after:size-full after:border-2 after:rounded-full checked:after:border-none after:transition-all after:duration-100 after:ease-in"
        id={uniqueId}
      />

      {!isChecked ? (
        <HeartPlus className="absolute h-8/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1" />
      ) : (
        <>
          <span
            ref={(node: HTMLSpanElement) => {
              if (!node) return;
              setTimeout(() => {
                node.hidden = true;
              }, 1000);
            }}
            className="absolute bg-neutral-800 opacity-90 px-2 py-0.5 text-sm rounded-full -top-[100%]"
          >
            Added to library
          </span>
          <Heart className="absolute h-8/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1" />
        </>
      )}
    </label>
  );
};

export default AddToLibraryToggle;
