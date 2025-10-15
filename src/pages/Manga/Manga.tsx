import MainLayout from "../../layouts/MainLayout";
import HeaderLayout from "../../layouts/HeaderLayout";
import { Outlet } from "react-router-dom";
import AddToLibraryToggle from "../../components/checkboxes/AddToLibrarytoggle";

const Manga = () => {
  return (
    <MainLayout>
      <div className="h-dvh w-full">
        <HeaderLayout>Manga</HeaderLayout>
        <div className="h-8 w-20 flex justify-center items-center">
          <AddToLibraryToggle
            callback={(isChecked) => {
              console.log(isChecked);
            }}
          />
        </div>
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default Manga;
