import { useCallback } from "react";
import type { ChangeEvent, FC } from "react";

type LabeledToggleProps = {
  logo: string;
  label: string;
  callback?: (name: string, isChecked: boolean) => void;
  checked?: boolean;
};

const LabeledToggle: FC<LabeledToggleProps> = ({
  label,
  logo,
  callback,
  checked = false,
}) => {
  const savedState = useCallback((node: HTMLInputElement) => {
    if (!node) return;

    node.checked = checked;
  }, []);

  return (
    <label
      htmlFor={label}
      className="w-full flex items-center gap-1 relative cursor-pointer"
    >
      <div
        className="size-6 bg-cover aspect-1/1"
        style={{
          backgroundImage: `url(${logo})`,
        }}
      ></div>
      <span className="!text-sm uppercase pointer-none select-none">
        {label}
      </span>
      <input
        ref={savedState}
        onChange={(node: ChangeEvent<HTMLInputElement>) => {
          const target = node.target;
          const isChecked = target.checked;
          if (callback) callback(label, isChecked);
        }}
        type="checkbox"
        id={label}
        className="absolute invisible size-full right-0 top-1/2 -translate-y-1/2 after:content-[''] after:absolute after:right-1 after:border after:h-7/10 after:visible after:top-1/2 after:-translate-y-1/2 after:w-10 after:rounded-full after:transition-colors after:duration-150 after:ease-in checked:after:bg-blue-300 before:z-2 before:content-[''] before:size-3 before:top-1/2 before:-translate-y-1/2 before:rounded-full before:absolute before:bg-white before:-translate-x-6.5 before:right-1 before:visible checked:before:-translate-x-0.5 before:transition-all before:ease-in before:duration-150 checked:before:bg-blue-700"
      />
    </label>
  );
};

export default LabeledToggle;
