import MainLayout from "../../layouts/MainLayout";
import HeaderLayout from "../../layouts/HeaderLayout";
import { Outlet } from "react-router-dom";

const History = () => {
  return (
    <MainLayout>
      <div className="h-dvh w-full">
        <HeaderLayout>History</HeaderLayout>
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default History;
