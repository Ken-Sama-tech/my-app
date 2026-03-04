import MainLayout from "../../../layouts/MainLayout";
import HeaderLayout from "../../../layouts/HeaderLayout";
import { useRef, useEffect, useState, useMemo } from "react";
import type { FC, ReactNode } from "react";
import { useLocation, useOutlet, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import debounce from "../../../lib/utils/debounce";

const Anime: FC = () => {
  const [search, setSearch] = useState<string>("");
  const [searchIsDisabled, setSearchIsDisabled] = useState<boolean>(false);
  const cacheRef = useRef<Map<string, ReactNode>>(new Map());
  const location = useLocation();
  const outlet = useOutlet();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const current = cacheRef.current;

  if (!current.has(pathname)) {
    current.set(pathname, outlet);
  }

  useEffect(() => {
    const watchKeys = [...current.keys()].filter((key) =>
      key.endsWith("watch"),
    );

    watchKeys.forEach((key) => {
      //I love thighs...well maybe armpits too?
      // document.querySelector(`div[custom-attr-path='${key}']`);
      current.delete(key);
    });
  });

  const updateSearch = useMemo(
    () =>
      debounce((val: string) => {
        console.log(val);
        setSearch(val);
        setSearchIsDisabled(false);
      }),
    [],
  );

  return (
    <MainLayout>
      <div className="relative w-full min-h-full h-fit">
        <HeaderLayout
          className="sticky z-2 top-0"
          element={
            <div className="h-full grow shrink-0 flex justify-end items-center">
              <div className="flex gap-1">
                <input
                  onChange={(node) => {
                    if (!node) return;
                    setSearchIsDisabled(true);
                    const value = node.target.value;
                    updateSearch(value);
                  }}
                  type="search"
                  placeholder="Search..."
                  className="outline-none border-transparent border border-b-neutral-400 px-2"
                />

                <button
                  onClick={() => {
                    navigate(`/anime/filter?query=${search}`);
                  }}
                  {...{ disabled: searchIsDisabled }}
                  className="bg-blue-700 px-4 py-2 flex gap-2 rounded-md cursor-pointer"
                >
                  <Search className="size-full" /> Search
                </button>
              </div>
            </div>
          }
        >
          Anime
        </HeaderLayout>
        {[...current.entries()].map(([path, element]) => {
          return (
            <div
              custom-attr-path={path}
              key={path}
              style={{
                display: path === pathname ? "block" : "none",
              }}
            >
              {element}
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default Anime;
