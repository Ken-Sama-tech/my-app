import Navbar from "./Navbar";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import type { LayoutProps } from "./types/layouts";

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <div className="h-dvh w-full flex flex-col shrink-0 grow-0">
      <div className="h-[30px] bg-neutral-800 w-full flex items-center px-2 shadow-xl z-99">
        <button
          type="button"
          className="size-7 cursor-pointer md:hidden"
          onClick={() => setIsActive(isActive ? false : true)}
        >
          <Menu className="size-full text-white" strokeWidth={2} />
        </button>
      </div>
      <div className="flex h-[calc(100%-30px)] z-2 ">
        <Navbar active={isActive} />
        <main className="bg-neutral-900 h-full w-full flex overflow-y-auto rm-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
