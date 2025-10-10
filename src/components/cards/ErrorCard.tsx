import { AlertCircle } from "lucide-react";
import type { ErrorCardProps } from "./types/cards";
import type { FC } from "react";

const ErrorCard: FC<ErrorCardProps> = ({ message, title }) => {
  return (
    <div className="max-w-sm mx-auto rounded-lg border-2 border-red-400 bg-neutral-800 w-8/10 h-fit p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle color="#fb2c36" className="h-6 w-6 !text-red-500" />
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold !text-red-500">{title}</h3>
          <p className="text-sm !text-red-500">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;
