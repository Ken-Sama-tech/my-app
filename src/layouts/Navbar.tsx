import React from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

type NavbarProps = {
  active: boolean;
};

type RoutesProps = {
  label: string;
  path: string;
};

const routes = (await axios.get<Array<RoutesProps>>("/routes.json")).data;

const Navbar: React.FC<NavbarProps> = ({ active }) => {
  return (
    <nav
      className={`w-5/12 z-99 absolute top-[30px] bottom-0 md:left-0 md:!translate-x-0 md:relative md:top-0 sm:w-4/12 bg-neutral-800 grow-0 shrink-0 md:w-3/12 lg:w-2/12 transition-all duration-200 ease-in ${
        active ? "opacity-100" : "-translate-x-full"
      }`}
    >
      <ul className="list-none w-full h-auto p-1">
        {routes.map((route: RoutesProps, idx: number) => {
          return (
            <li
              key={idx}
              className="size-full hover:bg-neutral-500 pointer-none:"
            >
              <NavLink
                to={route.path}
                className={({ isActive }) => {
                  const staticStyle = "block size-full p-1";
                  if (isActive) {
                    document.title = route.label;
                    return `${staticStyle} border-slide-active`;
                  }

                  return staticStyle;
                }}
              >
                {route.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
