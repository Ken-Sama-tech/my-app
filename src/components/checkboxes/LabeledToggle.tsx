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
      // title={label}
      htmlFor={label}
      className="w-full rounded-md group px-1 py-0.5 hover:bg-neutral-400 active:bg-neutral-400 flex items-center gap-1 relative cursor-pointer"
    >
      <div
        className="size-6 bg-cover aspect-1/1 bg-center"
        style={{
          backgroundImage: `url(${logo})`,
        }}
      ></div>
      <span className="!text-sm line-clamp-1 max-w-1/2 text-ellipsis uppercase pointer-none select-none">
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
        className="labeled-toggle"
      />
      <span className="tooltip-bottom">{label}</span>
    </label>
  );
};

export default LabeledToggle;
