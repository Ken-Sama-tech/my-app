import MainLayout from "../../layouts/MainLayout";
import HeaderLayout from "../../layouts/HeaderLayout";
import { Outlet } from "react-router-dom";

const Manga = () => {
  return (
    <MainLayout>
      <div className="h-dvh w-full">
        <HeaderLayout>Manga</HeaderLayout>
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default Manga;
