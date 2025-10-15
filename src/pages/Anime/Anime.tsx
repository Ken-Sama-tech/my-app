import MainLayout from "../../layouts/MainLayout";
import HeaderLayout from "../../layouts/HeaderLayout";
import { Outlet } from "react-router-dom";
import KebabButton from "../../components/buttons/KebabButton";
import AnimeOptions from "../../features/Anime/AnimeOptions";

const Anime = () => {
  return (
    <MainLayout>
      <div className="h-fit relative w-full">
        <HeaderLayout
          className="sticky z-1 top-0"
          element={
            <div className="h-full w-full flex justify-center items-center">
              <div className="w-fit gap-x-2 justify-center items-center flex absolute right-2 top-1/2 -translate-y-1/2 h-full">
                <KebabButton element={<AnimeOptions />} className="!relative" />
              </div>
            </div>
          }
        >
          Anime
        </HeaderLayout>
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default Anime;
