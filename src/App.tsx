import { Route, Routes, Navigate } from "react-router-dom";
import type { RoutesKey, RoutesResponse, RoutesValue } from "./types/routes";
import Library from "./pages/Library/Library";
import History from "./pages/History/History";
import Anime from "./features/Anime/layouts/AnimeMainLayout";
import Manga from "./pages/Manga/Manga";
import Novel from "./pages/Novel/Novel";
import axios from "axios";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AnimeHomePage from "./pages/Anime/AnimeHomePage";
import LibraryHomePage from "./pages/Library/LibraryHomePage";
import AnimeDetail from "./pages/Anime/AnimeDetail";
import AnimeWatch from "./pages/Anime/AnimeWatch";

const queryClient = new QueryClient();
const routes = (await axios.get<Array<RoutesResponse>>("/routes.json")).data;
const routesMap: Map<RoutesKey, RoutesValue> = new Map([
  [
    "Anime",
    {
      layout: <Anime />,
      default: <AnimeHomePage />,
      childrenRoutes: new Map([
        ["Anime Detail", <AnimeDetail />],
        ["Watch", <AnimeWatch />],
      ]),
    },
  ],
  [
    "Manga",
    {
      layout: <Manga />,
      default: <h1>Test</h1>,
    },
  ],
  [
    "Novel",
    {
      layout: <Novel />,
      default: <h1>ansns</h1>,
    },
  ],
  [
    "Library",
    {
      layout: <Library />,
      default: <LibraryHomePage />,
    },
  ],
  [
    "History",
    {
      layout: <History />,
      default: <h1>asbans</h1>,
    },
  ],
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route index element={<Navigate to="/library" replace />} />
        {routes.map((route, idx) => {
          const label = route.label;
          const parentRoute = routesMap.get(label);
          return (
            <Route
              key={route.label}
              path={route.path}
              element={parentRoute?.layout}
            >
              <Route key={idx} index element={parentRoute?.default} />
              {route.children?.map((c) => {
                const childrenRoutes = parentRoute?.childrenRoutes;
                return (
                  <Route
                    key={c.label}
                    path={c.path}
                    element={childrenRoutes?.get(c.label)}
                  />
                );
              })}
            </Route>
          );
        })}
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
