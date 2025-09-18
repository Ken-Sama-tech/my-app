import { FC } from "react";
import { BadgeAlert } from "lucide-react";

type SimpleError = {
  message?: string;
};

const SimpleError: FC<SimpleError> = ({ message = "Unknown Error" }) => {
  return (
    <div className="flex items-center gap-2 border border-red-400 bg-red-400/10 px-3 py-2 rounded-md">
      <BadgeAlert className="w-5 h-5 text-red-400 shrink-0" />
      <span className="text-sm text-red-100 font-medium">{message}</span>
    </div>
  );
};

export default SimpleError;
