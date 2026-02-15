import type { FC } from "react";
import { RotateCcw } from "lucide-react";

type RetryButtonProps = {
  callback?: () => void;
};

const RetryButton: FC<RetryButtonProps> = ({ callback }) => {
  return (
    <button
      onClick={() => {
        if (callback) callback();
      }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer opacity-90 bg-blue-700 text-white hover:opacity-100 transition-all"
    >
      <RotateCcw className="w-4 h-4" />
      Retry
    </button>
  );
};

export default RetryButton;
