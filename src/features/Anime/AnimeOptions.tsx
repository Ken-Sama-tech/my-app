import { type FC } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { AnimeExtensionsResponse } from "../../../server/models/types/Extensions";
import LabeledToggle from "../../components/checkboxes/LabeledToggle";

const base = import.meta.env.VITE_API_URL;

const AnimeOptions: FC = () => {
  const {
    data: extensions,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["extensions"],
    queryFn: () =>
      axios.get<AnimeExtensionsResponse[]>(`${base}/extensions/anime`),
  });

  return (
    <div className="size-full flex flex-col p-2 z-2">
      <div className="w-full flex flex-col items-end">
        <span className="text-md font-semibold w-full">Extensions</span>
        <ul className="grid size-full p-2">
          {extensions?.data.map((ext, idx) => {
            return (
              <li
                key={idx}
                className="w-full px-1 py-0.5 hover:bg-neutral-400 rounded-md"
              >
                <LabeledToggle
                  logo={ext.logo_url}
                  label={ext.name}
                  callback={async (_, isChecked) => {
                    const api = `${base}/extensions/anime/update`;
                    await axios.patch<AnimeExtensionsResponse>(api, {
                      active: isChecked,
                      _id: ext._id,
                    });
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AnimeOptions;
