import MainLayout from "../../../layouts/MainLayout";
import HeaderLayout from "../../../layouts/HeaderLayout";
import { useRef, useEffect } from "react";
import type { FC, ReactNode } from "react";
import { useLocation, useOutlet } from "react-router-dom";

const Anime: FC = () => {
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
      key.endsWith("watch"),
    );

    watchKeys.forEach((key) => {
      //I love thights...well maybe armpits too?
      document.querySelector(`div[custom-attr-path='${key}']`);
      current.delete(key);
    });
  });

  return (
    <MainLayout>
      <div className="relative w-full min-h-full h-fit">
        <HeaderLayout className="sticky z-2 top-0">Anime</HeaderLayout>
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
