import { type FC } from "react";
import axios from "axios";
import type { ExtensionsResponse } from "../../../server/models/types/Extensions";
import LabeledToggle from "../../components/checkboxes/LabeledToggle";
import useExtensions from "../../lib/hooks/useExtensions";
import SimpleError from "../../components/ui/SimpleError";

const base = import.meta.env.VITE_API_URL;

const AnimeOptions: FC = () => {
  const { data: extensions, isError } = useExtensions("anime");

  console.log(extensions);

  return (
    <div className="size-full flex flex-col p-2 z-2">
      <div className="w-full flex flex-col items-end">
        <span className="text-md font-semibold w-full">Extensions</span>
        {!isError && (
          <ul className="grid size-full p-2">
            {extensions?.map((ext, idx) => {
              return (
                <li
                  key={idx}
                  className="w-full px-1 py-0.5 hover:bg-neutral-400 rounded-md"
                >
                  <LabeledToggle
                    logo={ext.logo}
                    label={ext.name}
                    checked={ext.active}
                    callback={async (_, isChecked) => {
                      const api = `${base}/extensions/anime/update`;
                      await axios.patch<ExtensionsResponse>(api, {
                        active: isChecked,
                        _id: ext._id,
                      });
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
        {isError && (
          <div className="flex w-full justify-center mt-1 items-center">
            <SimpleError message="Failed to load" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeOptions;
