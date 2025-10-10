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
            <KebabButton Element={AnimeOptions} className="!absolute right-4" />
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
