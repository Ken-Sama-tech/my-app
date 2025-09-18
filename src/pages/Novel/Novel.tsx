import MainLayout from "../../layouts/MainLayout";
import HeaderLayout from "../../layouts/HeaderLayout";
import { Outlet } from "react-router-dom";

const Novel = () => {
  return (
    <MainLayout>
      <div className="h-dvh w-full">
        <HeaderLayout>Novel</HeaderLayout>
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default Novel;
