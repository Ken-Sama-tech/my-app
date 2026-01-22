import MainLayout from "../../../layouts/MainLayout";
import HeaderLayout from "../../../layouts/HeaderLayout";
import KebabButton from "../../../components/buttons/KebabButton";
import AnimeOptions from "../components/AnimeOptions";
import { useRef, useEffect } from "react";
import type { Options } from "../components/AnimeOptions";
import type { FC, ReactNode } from "react";
import AnimeOptionsContext from "../contexts/AnimeOptionContext";
import { useLocation, useOutlet } from "react-router-dom";

const Anime: FC = () => {
  const optionsRef = useRef<Options | null>(null);
  const cacheRef = useRef<Map<string, ReactNode>>(new Map());
  const location = useLocation();
  const outlet = useOutlet();
  const pathname = location.pathname;
  const current = cacheRef.current;

  if (!current.has(pathname)) {
    current.set(pathname, outlet);
  }

  useEffect(() => {
    const watchKeys = [...current.keys()].filter((key) =>
      key.endsWith("watch")
    );

    watchKeys.forEach((key) => {
      //I love thights...well maybe armpits too?
      document.querySelector(`div[custom-attr-path='${key}']`);
      current.delete(key);
    });
  });

  return (
    <MainLayout>
      <AnimeOptionsContext.Provider value={optionsRef}>
        <div className="h-fit relative w-full">
          <HeaderLayout
            className="sticky z-2 top-0"
            element={
              <div className="h-full w-full flex justify-center items-center">
                <div className="w-fit gap-x-2 justify-center items-center flex absolute right-2 top-1/2 -translate-y-1/2 h-full">
                  <KebabButton
                    element={
                      <AnimeOptions
                        callback={({ current }) => {
                          optionsRef.current = current;
                        }}
                      />
                    }
                    className="relative!"
                  />
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
      </AnimeOptionsContext.Provider>
    </MainLayout>
  );
};

export default Anime;
