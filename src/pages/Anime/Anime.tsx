import MainLayout from "../../layouts/MainLayout";
import HeaderLayout from "../../layouts/HeaderLayout";
import { Outlet } from "react-router-dom";

const Anime = () => {
  return (
    <MainLayout>
      <div className="h-fit relative w-full">
        <HeaderLayout kebabOption filterOption className="sticky z-1 top-0">
          Anime
        </HeaderLayout>
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default Anime;
