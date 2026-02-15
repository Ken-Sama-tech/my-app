import type { FC } from "react";
import { useCallback, useRef } from "react";
import { fetchExtensions, updateExtensions } from "../../../lib/api/extensions";
import { fetchAnime } from "../../../lib/api/anime";
import type { ExtensionsSchema } from "../../../../shared-types/extensions";
import { useQuery } from "@tanstack/react-query";
import type { AnimeExtensions } from "../../../../shared-types/extensions";
import { Ellipsis } from "lucide-react";
import type { ObjectId } from "mongoose";
import { MoveRight, FileImage } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AnimeExtensionsResultsProps = {
  title: string;
  idMal?: number;
};

type AnimeExtensionResultProps = {
  extensionName: string;
  imageUrl?: string;
  hasResult?: boolean;
  to?: string;
};

const AnimeExtensionResult: FC<AnimeExtensionResultProps> = ({
  hasResult = false,
  imageUrl,
  extensionName,
  to = "#",
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-fit bg-neutral-700 rounded-lg shrink-0 flex flex-col p-1.5 justify-evenly gap-1">
      <div className="w-full h-full flex justify-items-center items-center p-0.5 rounded-md">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${extensionName}-logo`}
            className="h-8 aspect-square shrink-0 object-cover select-none"
          />
        )}

        {!imageUrl && <FileImage className="h-8 shrink-0 select-none" />}
        <span className="text-lg capitalize">{extensionName}</span>
      </div>

      {hasResult && (
        <>
          <button
            onClick={() => navigate(to)}
            type="button"
            className="w-full py-1 bg-blue-700 rounded-lg cursor-pointer flex justify-center items-center gap-1"
          >
            <span className="text-lg">Watch</span>{" "}
            <MoveRight className="h-full" />
          </button>
        </>
      )}

      {!hasResult && (
        <>
          <button
            disabled
            className="w-full py-1 bg-neutral-500 rounded-lg cursor-pointer flex justify-center items-center gap-1"
          >
            <span className="text-lg">No result found</span>{" "}
          </button>
        </>
      )}
    </div>
  );
};

const AnimeExtensionsResults: FC<AnimeExtensionsResultsProps> = ({
  title,
  idMal,
}) => {
  const extensions = useRef<ExtensionsSchema[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const {
    data: search,
    isError,
    isLoading,
    refetch,
  } = useQuery<Awaited<ReturnType<typeof fetchAnime>>>({
    queryKey: [title, idMal],
    queryFn: () =>
      (async () => {
        const response = await fetchExtensions({
          type: "anime",
        });

        const activeExtensions: AnimeExtensions[] = [];

        if (!response.error && response.data) {
          response.data.map((extension) => {
            const name = extension.name;
            if (extension.active) activeExtensions.push(name);

            const index = extensions.current.findIndex(
              ({ _id }) => extension._id === _id,
            );

            if (index === -1) {
              extensions.current.push(extension);
              return;
            }

            const hasChange =
              extensions.current[index].active !== extension.active;

            if (hasChange) extensions.current[index] = extension;
          });
        }

        return await fetchAnime({
          extensions: activeExtensions,
          title,
          idMal,
        });
      })(),
  });

  const selectExtensionRef = useCallback(
    (node: HTMLButtonElement, _id: ObjectId) => {
      if (!node) return;
      const checkbox = node.lastChild as HTMLInputElement;

      const update = () => {
        const active = !checkbox.checked;
        checkbox.checked = active;
        updateExtensions(_id, { active }).then(() => refetch());
      };

      node.addEventListener("click", update);

      return () => {
        node.removeEventListener("click", update);
      };
    },
    [],
  );

  console.log(search);

  return (
    <div className="w-full h-full relative flex">
      {isLoading && (
        <div className="absolute h-[40vh] w-full rounded-lg bottom-0 top-0 skeleton"></div>
      )}

      {!isLoading && (
        <>
          {!isError && (
            <div className="ablosute min-h-[40vh] h-fit bottom-0 rounded-2xl flex flex-col top-0 w-full pt-2 pb-4 px-2 bg-neutral-800 items-center">
              <div className="h-8 w-[99%] flex justify-end relative">
                <button
                  onClick={() => {
                    if (!menuRef) return;
                    menuRef.current?.classList.toggle("active");
                  }}
                  className="cursor-pointer h-full w-fit"
                >
                  <Ellipsis className="size-full" />
                </button>

                <div ref={menuRef} className="menu mt-1 gap-0.5">
                  {extensions.current.map((extension, idx) => {
                    return (
                      <button
                        ref={(node: HTMLButtonElement) =>
                          selectExtensionRef(node, extension._id)
                        }
                        key={`${extension}-${idx}`}
                        className="px-1 py-0.5 rounded-sm w-full flex gap-1 cursor-pointer hover:bg-neutral-500"
                      >
                        <div
                          className="aspect-square h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url("${extension.logo}")`,
                          }}
                        ></div>
                        <span className="grow text-start">
                          {extension.name}
                        </span>
                        <input
                          type="checkbox"
                          checked={extension.active}
                          readOnly
                          className="pointer-events-none"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="h-0.5 my-1 w-full bg-neutral-300 rounded-full"></div>
              <div className="h-full w-full py-2 grow grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-start place-items-start">
                {search?.map((res) => {
                  const { error, data, message } = res;

                  if (error) {
                    console.error("Error:", message);
                  }

                  if (!data) {
                    console.log("No result found");
                    return;
                  }

                  const { extension, result } = data;
                  const id = result?.id;

                  const { logo } =
                    extensions.current.find(({ name }) => name == extension) ||
                    {};

                  return (
                    <AnimeExtensionResult
                      to={`watch?extension=${extension}&id=${id}`}
                      hasResult={!error}
                      extensionName={extension}
                      imageUrl={logo}
                      key={`${extension}-res-${title}`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnimeExtensionsResults;
