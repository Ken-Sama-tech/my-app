import MainLayout from "../../layouts/MainLayout";
import HeaderLayout from "../../layouts/HeaderLayout";
// import LibraryOptions from "../../features/Library/LibraryOptions";
import { Outlet } from "react-router-dom";

const Library = () => {
  return (
    <MainLayout>
      <div className="h-full w-full">
        <HeaderLayout>Library</HeaderLayout>
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default Library;
